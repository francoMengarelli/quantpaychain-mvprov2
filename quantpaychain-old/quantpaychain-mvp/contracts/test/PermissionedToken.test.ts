
import { expect } from "chai";
import { ethers } from "hardhat";
import { PermissionedToken } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PermissionedToken", function () {
  let token: PermissionedToken;
  let owner: SignerWithAddress;
  let minter: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let blacklisted: SignerWithAddress;

  const TOKEN_NAME = "QuantPayChain Token";
  const TOKEN_SYMBOL = "QPC";
  const INITIAL_SUPPLY = ethers.parseEther("1000000");

  beforeEach(async function () {
    [owner, minter, user1, user2, blacklisted] = await ethers.getSigners();

    const PermissionedTokenFactory = await ethers.getContractFactory("PermissionedToken");
    token = await PermissionedTokenFactory.deploy(TOKEN_NAME, TOKEN_SYMBOL, INITIAL_SUPPLY);
    await token.waitForDeployment();

    // Grant minter role
    const MINTER_ROLE = await token.MINTER_ROLE();
    await token.grantRole(MINTER_ROLE, minter.address);
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await token.name()).to.equal(TOKEN_NAME);
      expect(await token.symbol()).to.equal(TOKEN_SYMBOL);
    });

    it("Should mint initial supply to owner", async function () {
      expect(await token.balanceOf(owner.address)).to.equal(INITIAL_SUPPLY);
    });

    it("Should whitelist the owner by default", async function () {
      expect(await token.isWhitelisted(owner.address)).to.be.true;
    });

    it("Should start in blacklist mode", async function () {
      expect(await token.whitelistMode()).to.be.false;
    });

    it("Should grant roles to owner", async function () {
      const ADMIN_ROLE = await token.ADMIN_ROLE();
      const MINTER_ROLE = await token.MINTER_ROLE();
      const DEFAULT_ADMIN_ROLE = await token.DEFAULT_ADMIN_ROLE();

      expect(await token.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
      expect(await token.hasRole(ADMIN_ROLE, owner.address)).to.be.true;
      expect(await token.hasRole(MINTER_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Minting", function () {
    it("Should allow minter to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await token.connect(minter).mint(user1.address, mintAmount);
      expect(await token.balanceOf(user1.address)).to.equal(mintAmount);
    });

    it("Should not allow non-minter to mint tokens", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        token.connect(user1).mint(user2.address, mintAmount)
      ).to.be.reverted;
    });

    it("Should not allow minting to zero address", async function () {
      const mintAmount = ethers.parseEther("1000");
      await expect(
        token.connect(minter).mint(ethers.ZeroAddress, mintAmount)
      ).to.be.revertedWith("Cannot mint to zero address");
    });
  });

  describe("Burning", function () {
    beforeEach(async function () {
      // Transfer some tokens to user1
      await token.transfer(user1.address, ethers.parseEther("1000"));
    });

    it("Should allow users to burn their own tokens", async function () {
      const burnAmount = ethers.parseEther("100");
      const initialBalance = await token.balanceOf(user1.address);
      
      await token.connect(user1).burn(burnAmount);
      
      expect(await token.balanceOf(user1.address)).to.equal(initialBalance - burnAmount);
    });

    it("Should allow burning tokens with allowance", async function () {
      const burnAmount = ethers.parseEther("100");
      
      // Approve user2 to burn user1's tokens
      await token.connect(user1).approve(user2.address, burnAmount);
      
      const initialBalance = await token.balanceOf(user1.address);
      await token.connect(user2).burnFrom(user1.address, burnAmount);
      
      expect(await token.balanceOf(user1.address)).to.equal(initialBalance - burnAmount);
    });

    it("Should not allow burning more than allowance", async function () {
      const burnAmount = ethers.parseEther("100");
      const approveAmount = ethers.parseEther("50");
      
      await token.connect(user1).approve(user2.address, approveAmount);
      
      await expect(
        token.connect(user2).burnFrom(user1.address, burnAmount)
      ).to.be.revertedWith("Burn amount exceeds allowance");
    });
  });

  describe("Whitelist Management", function () {
    it("Should allow admin to add address to whitelist", async function () {
      await token.addToWhitelist(user1.address);
      expect(await token.isWhitelisted(user1.address)).to.be.true;
    });

    it("Should allow admin to remove address from whitelist", async function () {
      await token.addToWhitelist(user1.address);
      await token.removeFromWhitelist(user1.address);
      expect(await token.isWhitelisted(user1.address)).to.be.false;
    });

    it("Should not allow non-admin to manage whitelist", async function () {
      await expect(
        token.connect(user1).addToWhitelist(user2.address)
      ).to.be.reverted;
    });

    it("Should not allow whitelisting zero address", async function () {
      await expect(
        token.addToWhitelist(ethers.ZeroAddress)
      ).to.be.revertedWith("Cannot whitelist zero address");
    });
  });

  describe("Blacklist Management", function () {
    it("Should allow admin to add address to blacklist", async function () {
      await token.addToBlacklist(blacklisted.address);
      expect(await token.isBlacklisted(blacklisted.address)).to.be.true;
    });

    it("Should allow admin to remove address from blacklist", async function () {
      await token.addToBlacklist(blacklisted.address);
      await token.removeFromBlacklist(blacklisted.address);
      expect(await token.isBlacklisted(blacklisted.address)).to.be.false;
    });

    it("Should not allow non-admin to manage blacklist", async function () {
      await expect(
        token.connect(user1).addToBlacklist(user2.address)
      ).to.be.reverted;
    });

    it("Should not allow blacklisting zero address", async function () {
      await expect(
        token.addToBlacklist(ethers.ZeroAddress)
      ).to.be.revertedWith("Cannot blacklist zero address");
    });
  });

  describe("Transfer Permissions - Blacklist Mode", function () {
    beforeEach(async function () {
      // Ensure we're in blacklist mode
      await token.setWhitelistMode(false);
    });

    it("Should allow transfers between non-blacklisted addresses", async function () {
      const transferAmount = ethers.parseEther("100");
      await token.transfer(user1.address, transferAmount);
      expect(await token.balanceOf(user1.address)).to.equal(transferAmount);
    });

    it("Should block transfers from blacklisted address", async function () {
      const transferAmount = ethers.parseEther("100");
      await token.transfer(blacklisted.address, transferAmount);
      
      await token.addToBlacklist(blacklisted.address);
      
      await expect(
        token.connect(blacklisted).transfer(user1.address, transferAmount)
      ).to.be.revertedWith("Transfer not allowed by permissions");
    });

    it("Should block transfers to blacklisted address", async function () {
      const transferAmount = ethers.parseEther("100");
      await token.addToBlacklist(blacklisted.address);
      
      await expect(
        token.transfer(blacklisted.address, transferAmount)
      ).to.be.revertedWith("Transfer not allowed by permissions");
    });
  });

  describe("Transfer Permissions - Whitelist Mode", function () {
    beforeEach(async function () {
      await token.setWhitelistMode(true);
    });

    it("Should allow transfers between whitelisted addresses", async function () {
      const transferAmount = ethers.parseEther("100");
      
      await token.addToWhitelist(user1.address);
      await token.transfer(user1.address, transferAmount);
      
      expect(await token.balanceOf(user1.address)).to.equal(transferAmount);
    });

    it("Should block transfers from non-whitelisted address", async function () {
      const transferAmount = ethers.parseEther("100");
      
      // First whitelist user1 to receive tokens
      await token.addToWhitelist(user1.address);
      await token.transfer(user1.address, transferAmount);
      
      // Now try to transfer from user1 (whitelisted) to user2 (not whitelisted)
      await expect(
        token.connect(user1).transfer(user2.address, transferAmount)
      ).to.be.revertedWith("Transfer not allowed by permissions");
    });

    it("Should block transfers to non-whitelisted address", async function () {
      const transferAmount = ethers.parseEther("100");
      
      await expect(
        token.transfer(user1.address, transferAmount)
      ).to.be.revertedWith("Transfer not allowed by permissions");
    });

    it("Should allow transfers when both parties are whitelisted", async function () {
      const transferAmount = ethers.parseEther("100");
      
      await token.addToWhitelist(user1.address);
      await token.addToWhitelist(user2.address);
      
      await token.transfer(user1.address, transferAmount);
      await token.connect(user1).transfer(user2.address, transferAmount);
      
      expect(await token.balanceOf(user2.address)).to.equal(transferAmount);
    });
  });

  describe("Mode Switching", function () {
    it("Should allow admin to switch to whitelist mode", async function () {
      await token.setWhitelistMode(true);
      expect(await token.whitelistMode()).to.be.true;
    });

    it("Should allow admin to switch to blacklist mode", async function () {
      await token.setWhitelistMode(true);
      await token.setWhitelistMode(false);
      expect(await token.whitelistMode()).to.be.false;
    });

    it("Should not allow non-admin to change mode", async function () {
      await expect(
        token.connect(user1).setWhitelistMode(true)
      ).to.be.reverted;
    });
  });

  describe("Transfer Allowed Check", function () {
    it("Should return true for allowed transfers in blacklist mode", async function () {
      expect(await token.isTransferAllowed(owner.address, user1.address)).to.be.true;
    });

    it("Should return false for blacklisted addresses", async function () {
      await token.addToBlacklist(blacklisted.address);
      expect(await token.isTransferAllowed(blacklisted.address, user1.address)).to.be.false;
      expect(await token.isTransferAllowed(user1.address, blacklisted.address)).to.be.false;
    });

    it("Should return correct values in whitelist mode", async function () {
      await token.setWhitelistMode(true);
      await token.addToWhitelist(user1.address);
      
      expect(await token.isTransferAllowed(owner.address, user1.address)).to.be.true;
      expect(await token.isTransferAllowed(user1.address, user2.address)).to.be.false;
    });
  });
});
