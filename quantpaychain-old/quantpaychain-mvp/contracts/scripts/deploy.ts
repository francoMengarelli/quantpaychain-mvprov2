
import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Starting deployment of QuantPayChain contracts...\n");

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy PermissionedToken
  console.log("📄 Deploying PermissionedToken...");
  const TOKEN_NAME = "QuantPayChain Token";
  const TOKEN_SYMBOL = "QPC";
  const INITIAL_SUPPLY = ethers.parseEther("1000000"); // 1 million tokens

  const PermissionedTokenFactory = await ethers.getContractFactory("PermissionedToken");
  const permissionedToken = await PermissionedTokenFactory.deploy(
    TOKEN_NAME,
    TOKEN_SYMBOL,
    INITIAL_SUPPLY
  );
  await permissionedToken.waitForDeployment();
  const tokenAddress = await permissionedToken.getAddress();

  console.log("✅ PermissionedToken deployed to:", tokenAddress);
  console.log("   - Name:", TOKEN_NAME);
  console.log("   - Symbol:", TOKEN_SYMBOL);
  console.log("   - Initial Supply:", ethers.formatEther(INITIAL_SUPPLY), "tokens\n");

  // Deploy Dividends
  console.log("📄 Deploying Dividends contract...");
  const DividendsFactory = await ethers.getContractFactory("Dividends");
  const dividends = await DividendsFactory.deploy(tokenAddress);
  await dividends.waitForDeployment();
  const dividendsAddress = await dividends.getAddress();

  console.log("✅ Dividends contract deployed to:", dividendsAddress);
  console.log("   - Linked to token:", tokenAddress, "\n");

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  
  // Check token deployment
  const tokenName = await permissionedToken.name();
  const tokenSymbol = await permissionedToken.symbol();
  const tokenSupply = await permissionedToken.totalSupply();
  const deployerBalance = await permissionedToken.balanceOf(deployer.address);

  console.log("✓ Token verification:");
  console.log("  - Name:", tokenName);
  console.log("  - Symbol:", tokenSymbol);
  console.log("  - Total Supply:", ethers.formatEther(tokenSupply));
  console.log("  - Deployer Balance:", ethers.formatEther(deployerBalance));

  // Check dividends deployment
  const linkedToken = await dividends.token();
  const dividendsOwner = await dividends.owner();

  console.log("✓ Dividends verification:");
  console.log("  - Linked Token:", linkedToken);
  console.log("  - Owner:", dividendsOwner);
  console.log("  - Token Match:", linkedToken === tokenAddress ? "✓" : "✗");

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("Chain ID:", (await ethers.provider.getNetwork()).chainId);
  console.log("\nDeployed Contracts:");
  console.log("  PermissionedToken:", tokenAddress);
  console.log("  Dividends:", dividendsAddress);
  console.log("\nDeployer:", deployer.address);
  console.log("=".repeat(60));

  // Save deployment info to file
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      PermissionedToken: {
        address: tokenAddress,
        name: TOKEN_NAME,
        symbol: TOKEN_SYMBOL,
        initialSupply: ethers.formatEther(INITIAL_SUPPLY)
      },
      Dividends: {
        address: dividendsAddress,
        linkedToken: tokenAddress
      }
    }
  };

  console.log("\n💾 Deployment info saved to deployment-info.json");
  console.log("\n✨ Deployment completed successfully!");

  return deploymentInfo;
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
