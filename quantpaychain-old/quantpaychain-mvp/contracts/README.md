
# QuantPayChain Smart Contracts

Smart contracts for the QuantPayChain MVP platform, implementing permissioned token management and dividend distribution functionality.

## 📋 Overview

This package contains the core smart contracts for QuantPayChain:

- **PermissionedToken**: ERC20 token with whitelist/blacklist permission system
- **Dividends**: Automated dividend distribution contract for token holders

## 🏗️ Architecture

### PermissionedToken.sol

A permissioned ERC20 token with role-based access control:

**Features:**
- Standard ERC20 functionality (transfer, approve, etc.)
- Role-based access control (ADMIN, MINTER roles)
- Dual permission modes:
  - **Blacklist Mode**: All transfers allowed except blacklisted addresses
  - **Whitelist Mode**: Only whitelisted addresses can transfer
- Mint and burn capabilities with proper permissions
- OpenZeppelin security standards

**Key Functions:**
- `mint(address to, uint256 amount)`: Mint new tokens (MINTER_ROLE required)
- `burn(uint256 amount)`: Burn own tokens
- `addToWhitelist(address account)`: Add address to whitelist (ADMIN_ROLE required)
- `addToBlacklist(address account)`: Add address to blacklist (ADMIN_ROLE required)
- `setWhitelistMode(bool enabled)`: Toggle between whitelist/blacklist modes

### Dividends.sol

Automated dividend distribution system:

**Features:**
- Proportional dividend distribution based on token holdings
- Automatic calculation of claimable dividends
- Support for multiple dividend deposits
- Reentrancy protection
- Real-time dividend tracking per holder

**Key Functions:**
- `deposit()`: Deposit ETH as dividends (anyone can deposit)
- `claim()`: Claim accumulated dividends
- `calculateDividends(address holder)`: Calculate claimable dividends for a holder
- `getDividendInfo(address holder)`: Get comprehensive dividend information

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with gas reporting
REPORT_GAS=true npm test

# Run tests with coverage
npm run coverage
```

### Deployment

#### Local Network

```bash
# Start local Hardhat node
npm run node

# In another terminal, deploy to local network
npm run deploy:local
```

#### Sepolia Testnet

1. Create a `.env` file in the contracts directory:

```env
SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
PRIVATE_KEY_DEPLOY=your_private_key_here
```

2. Deploy to Sepolia:

```bash
npm run deploy:sepolia
```

**⚠️ IMPORTANT**: Never commit your `.env` file or expose private keys!

## 📁 Project Structure

```
contracts/
├── contracts/
│   ├── PermissionedToken.sol    # Permissioned ERC20 token
│   ├── Dividends.sol             # Dividend distribution contract
│   └── DocumentRegistry.sol      # (Existing) Document registry
├── test/
│   ├── PermissionedToken.test.ts # Token contract tests
│   ├── Dividends.test.ts         # Dividends contract tests
│   └── DocumentRegistry.test.ts  # (Existing) Registry tests
├── scripts/
│   └── deploy.ts                 # Deployment script
├── hardhat.config.ts             # Hardhat configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🧪 Testing

The contracts include comprehensive test suites covering:

### PermissionedToken Tests
- ✅ Deployment and initialization
- ✅ Minting with role permissions
- ✅ Burning tokens
- ✅ Whitelist management
- ✅ Blacklist management
- ✅ Transfer permissions in both modes
- ✅ Mode switching
- ✅ Role-based access control

### Dividends Tests
- ✅ Deployment and initialization
- ✅ Dividend deposits
- ✅ Dividend calculations
- ✅ Claiming dividends
- ✅ Multiple holder scenarios
- ✅ Token balance changes
- ✅ Reentrancy protection

## 🔒 Security Considerations

1. **Access Control**: All sensitive functions are protected by role-based access control
2. **Reentrancy Protection**: Dividends contract uses OpenZeppelin's ReentrancyGuard
3. **Zero Address Checks**: All functions validate against zero addresses
4. **Integer Overflow**: Using Solidity 0.8.20+ with built-in overflow protection
5. **Tested**: Comprehensive test coverage for all critical functions

## 🌐 Network Configuration

The contracts are configured for the following networks:

- **Hardhat**: Local development network (chainId: 1337)
- **Localhost**: Local node (http://127.0.0.1:8545)
- **Sepolia**: Ethereum testnet (configured via environment variables)
- **Mainnet**: Ethereum mainnet (configured via environment variables)

**⚠️ WARNING**: Mainnet deployment requires extreme caution and proper security audits!

## 📝 Environment Variables

Create a `.env` file (use `ENV_SAMPLE` as template):

```env
# Sepolia Testnet
SEPOLIA_RPC_URL=https://eth-sepolia.public.blastapi.io
PRIVATE_KEY_DEPLOY=your_private_key_here

# Mainnet (DO NOT USE without proper audits)
MAINNET_RPC_URL=https://eth-mainnet.public.blastapi.io
```

## 🔧 Available Scripts

- `npm test`: Run all tests
- `npm run compile`: Compile contracts
- `npm run deploy:local`: Deploy to local network
- `npm run deploy:sepolia`: Deploy to Sepolia testnet
- `npm run node`: Start local Hardhat node
- `npm run clean`: Clean artifacts and cache

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethers.js Documentation](https://docs.ethers.org)

## 🤝 Contributing

1. Write tests for new features
2. Ensure all tests pass
3. Follow Solidity style guide
4. Document all public functions
5. Update this README if needed

## 📄 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

These contracts are provided as-is for the QuantPayChain MVP. They have not been audited by third-party security firms. Use at your own risk, especially on mainnet.
