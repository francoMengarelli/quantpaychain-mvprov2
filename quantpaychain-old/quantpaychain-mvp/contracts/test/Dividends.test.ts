
import { expect } from "chai";
import { ethers } from "hardhat";
import { PermissionedToken, Dividends } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Dividends", function () {
  let token: PermissionedToken;
  let dividends: Dividends;
  let owner: SignerWithAddress;
  let holder1: SignerWithAddress;
  let holder2: SignerWithAddress;
  let holder3: SignerWithAddress;

  const TOKEN_NAME = "QuantPayChain Token";
  const TOKEN_SYMBOL = "QPC";
  const INITIAL_SUPPLY = ethers.parseEther("1000000");

  beforeEach(async function () {
    [owner, holder1, holder2, holder3] = await ethers.getSigners();

    // Deploy PermissionedToken
    const PermissionedTokenFactory = await ethers.getContractFactory("PermissionedToken");
    token = await PermissionedTokenFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY);
    await token.waitForDeployment();

    // Deploy Dividends contract
    const DividendsFactory = await ethers.getContractFactory("Dividends");
    dividends = await DividendsFactory.deploy(await token.getAddress());
    await dividends.waitForDeployment();

    // Distribute tokens to holders
    await token.transfer(holder1.address, ethers.parseEther("100000"));
    await token.transfer(holder2.address, ethers.parseEther("200000"));
    await token.transfer(holder3.address, ethers.parseEther("300000"));
  });

  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      expect(await dividends.token()).to.equal(await token.getAddress());
    });

    it("Should set the correct owner", async function () {
      expect(await dividends.owner()).to.equal(owner.address);
    });

    it("Should initialize with zero dividends", async function () {
      expect(await dividends.totalDividendsDeposited()).to.equal(0);
      expect(await dividends.totalDividendsClaimed()).to.equal(0);
    });

    it("Should not allow deployment with zero token address", async function () {
      const DividendsFactory = await ethers.getContractFactory("Dividends");
      await expect(
        DividendsFactory.deploy(ethers.ZeroAddress)
      ).to.be.revertedWith("Token address cannot be zero");
    });
  });

  describe("Deposit Dividends", function () {
    it("Should allow depositing dividends", async function () {
      const depositAmount = ethers.parseEther("10");
      
      await expect(dividends.deposit({ value: depositAmount }))
        .to.emit(dividends, "DividendsDeposited");

      expect(await dividends.totalDividendsDeposited()).to.equal(depositAmount);
    });

    it("Should not allow depositing zero amount", async function () {
      await expect(
        dividends.deposit({ value: 0 })
      ).to.be.revertedWith("Must deposit more than 0");
    });

    it("Should update dividends per token correctly", async function () {
      const depositAmount = ethers.parseEther("10");
      const totalSupply = await token.totalSupply();
      
      await dividends.deposit({ value: depositAmount });
      
      const expectedDividendsPerToken = (depositAmount * ethers.parseEther("1")) / totalSupply;
      expect(await dividends.dividendsPerTokenStored()).to.equal(expectedDividendsPerToken);
    });

    it("Should allow multiple deposits", async function () {
      const deposit1 = ethers.parseEther("5");
      const deposit2 = ethers.parseEther("10");
      
      await dividends.deposit({ value: deposit1 });
      await dividends.deposit({ value: deposit2 });
      
      expect(await dividends.totalDividendsDeposited()).to.equal(deposit1 + deposit2);
    });

    it("Should accept ETH sent directly to contract", async function () {
      const sendAmount = ethers.parseEther("5");
      
      await expect(
        owner.sendTransaction({
          to: await dividends.getAddress(),
          value: sendAmount
        })
      ).to.emit(dividends, "DividendsDeposited");

      expect(await dividends.totalDividendsDeposited()).to.equal(sendAmount);
    });
  });

  describe("Calculate Dividends", function () {
    beforeEach(async function () {
      // Deposit dividends
      await dividends.deposit({ value: ethers.parseEther("100") });
    });

    it("Should calculate correct dividends for holder", async function () {
      const holder1Balance = await token.balanceOf(holder1.address);
      const totalSupply = await token.totalSupply();
      const totalDividends = ethers.parseEther("100");
      
      const expectedDividends = (holder1Balance * totalDividends) / totalSupply;
      const calculatedDividends = await dividends.calculateDividends(holder1.address);
      
      // Allow for small rounding differences
      expect(calculatedDividends).to.be.closeTo(expectedDividends, ethers.parseEther("0.001"));
    });

    it("Should return zero dividends for address with no tokens", async function () {
      const [, , , , noTokensAddress] = await ethers.getSigners();
      expect(await dividends.calculateDividends(noTokensAddress.address)).to.equal(0);
    });

    it("Should calculate proportional dividends for multiple holders", async function () {
      const holder1Dividends = await dividends.calculateDividends(holder1.address);
      const holder2Dividends = await dividends.calculateDividends(holder2.address);
      const holder3Dividends = await dividends.calculateDividends(holder3.address);
      
      // holder2 has 2x tokens of holder1, should have ~2x dividends
      expect(holder2Dividends).to.be.closeTo(holder1Dividends * 2n, ethers.parseEther("0.001"));
      
      // holder3 has 3x tokens of holder1, should have ~3x dividends
      expect(holder3Dividends).to.be.closeTo(holder1Dividends * 3n, ethers.parseEther("0.001"));
    });
  });

  describe("Claim Dividends", function () {
    beforeEach(async function () {
      await dividends.deposit({ value: ethers.parseEther("100") });
    });

    it("Should allow holder to claim dividends", async function () {
      const initialBalance = await ethers.provider.getBalance(holder1.address);
      const claimableDividends = await dividends.calculateDividends(holder1.address);
      
      const tx = await dividends.connect(holder1).claim();
      const receipt = await tx.wait();
      const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
      
      const finalBalance = await ethers.provider.getBalance(holder1.address);
      
      expect(finalBalance).to.be.closeTo(
        initialBalance + claimableDividends - gasUsed,
        ethers.parseEther("0.001")
      );
    });

    it("Should emit DividendsClaimed event", async function () {
      await expect(dividends.connect(holder1).claim())
        .to.emit(dividends, "DividendsClaimed");
    });

    it("Should update claimed dividends tracking", async function () {
      const claimableDividends = await dividends.calculateDividends(holder1.address);
      
      await dividends.connect(holder1).claim();
      
      expect(await dividends.userDividendsClaimed(holder1.address)).to.equal(claimableDividends);
      expect(await dividends.totalDividendsClaimed()).to.equal(claimableDividends);
    });

    it("Should not allow claiming when no dividends available", async function () {
      await dividends.connect(holder1).claim();
      
      await expect(
        dividends.connect(holder1).claim()
      ).to.be.revertedWith("No dividends to claim");
    });

    it("Should allow claiming after new deposit", async function () {
      await dividends.connect(holder1).claim();
      
      // New deposit
      await dividends.deposit({ value: ethers.parseEther("50") });
      
      const newClaimable = await dividends.calculateDividends(holder1.address);
      expect(newClaimable).to.be.gt(0);
      
      await expect(dividends.connect(holder1).claim()).to.not.be.reverted;
    });

    it("Should handle multiple holders claiming", async function () {
      const holder1Claimable = await dividends.calculateDividends(holder1.address);
      const holder2Claimable = await dividends.calculateDividends(holder2.address);
      const holder3Claimable = await dividends.calculateDividends(holder3.address);
      
      await dividends.connect(holder1).claim();
      await dividends.connect(holder2).claim();
      await dividends.connect(holder3).claim();
      
      const totalClaimed = await dividends.totalDividendsClaimed();
      const expectedTotal = holder1Claimable + holder2Claimable + holder3Claimable;
      
      expect(totalClaimed).to.be.closeTo(expectedTotal, ethers.parseEther("0.001"));
    });
  });

  describe("Dividend Info", function () {
    beforeEach(async function () {
      await dividends.deposit({ value: ethers.parseEther("100") });
    });

    it("Should return correct dividend info", async function () {
      const [balance, claimable, claimed] = await dividends.getDividendInfo(holder1.address);
      
      expect(balance).to.equal(await token.balanceOf(holder1.address));
      expect(claimable).to.equal(await dividends.calculateDividends(holder1.address));
      expect(claimed).to.equal(0);
    });

    it("Should update claimed amount after claiming", async function () {
      const claimableAmount = await dividends.calculateDividends(holder1.address);
      await dividends.connect(holder1).claim();
      
      const [, , claimed] = await dividends.getDividendInfo(holder1.address);
      expect(claimed).to.equal(claimableAmount);
    });
  });

  describe("Unclaimed Dividends", function () {
    it("Should return correct unclaimed dividends", async function () {
      const depositAmount = ethers.parseEther("100");
      await dividends.deposit({ value: depositAmount });
      
      expect(await dividends.getUnclaimedDividends()).to.equal(depositAmount);
    });

    it("Should decrease unclaimed dividends after claims", async function () {
      const depositAmount = ethers.parseEther("100");
      await dividends.deposit({ value: depositAmount });
      
      const holder1Claimable = await dividends.calculateDividends(holder1.address);
      await dividends.connect(holder1).claim();
      
      const unclaimed = await dividends.getUnclaimedDividends();
      expect(unclaimed).to.be.closeTo(
        depositAmount - holder1Claimable,
        ethers.parseEther("0.001")
      );
    });
  });

  describe("Update Token", function () {
    it("Should allow owner to update token address", async function () {
      const PermissionedTokenFactory = await ethers.getContractFactory("PermissionedToken");
      const newToken = await PermissionedTokenFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY);
      await newToken.waitForDeployment();
      
      await expect(dividends.updateToken(await newToken.getAddress()))
        .to.emit(dividends, "TokenUpdated")
        .withArgs(await newToken.getAddress());
      
      expect(await dividends.token()).to.equal(await newToken.getAddress());
    });

    it("Should not allow non-owner to update token", async function () {
      const PermissionedTokenFactory = await ethers.getContractFactory("PermissionedToken");
      const newToken = await PermissionedTokenFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY);
      await newToken.waitForDeployment();
      
      await expect(
        dividends.connect(holder1).updateToken(await newToken.getAddress())
      ).to.be.reverted;
    });

    it("Should not allow updating to zero address", async function () {
      await expect(
        dividends.updateToken(ethers.ZeroAddress)
      ).to.be.revertedWith("Token address cannot be zero");
    });
  });

  describe("Contract Balance", function () {
    it("Should return correct contract balance", async function () {
      const depositAmount = ethers.parseEther("50");
      await dividends.deposit({ value: depositAmount });
      
      expect(await dividends.getContractBalance()).to.equal(depositAmount);
    });

    it("Should update balance after claims", async function () {
      const depositAmount = ethers.parseEther("100");
      await dividends.deposit({ value: depositAmount });
      
      const claimableAmount = await dividends.calculateDividends(holder1.address);
      await dividends.connect(holder1).claim();
      
      const expectedBalance = depositAmount - claimableAmount;
      expect(await dividends.getContractBalance()).to.be.closeTo(
        expectedBalance,
        ethers.parseEther("0.001")
      );
    });
  });
});
