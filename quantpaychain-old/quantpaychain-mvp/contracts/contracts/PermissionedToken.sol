
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title PermissionedToken
 * @dev ERC20 token with permission-based transfers (whitelist/blacklist)
 * @notice This contract implements a permissioned token system with role-based access control
 */
contract PermissionedToken is ERC20, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // Whitelist and blacklist mappings
    mapping(address => bool) private _whitelist;
    mapping(address => bool) private _blacklist;

    // Permission mode: true = whitelist mode, false = blacklist mode
    bool public whitelistMode;

    // Events
    event AddressWhitelisted(address indexed account);
    event AddressRemovedFromWhitelist(address indexed account);
    event AddressBlacklisted(address indexed account);
    event AddressRemovedFromBlacklist(address indexed account);
    event WhitelistModeChanged(bool enabled);

    /**
     * @dev Constructor that sets up the token with initial supply and roles
     * @param name Token name
     * @param symbol Token symbol
     * @param initialSupply Initial token supply (in wei)
     */
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        // Whitelist the deployer by default
        _whitelist[msg.sender] = true;
        whitelistMode = false; // Start in blacklist mode

        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply);
        }
    }

    /**
     * @dev Mints new tokens to a specified address
     * @param to Address to receive the minted tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(to != address(0), "Cannot mint to zero address");
        _mint(to, amount);
    }

    /**
     * @dev Burns tokens from the caller's balance
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Burns tokens from a specified address (requires allowance)
     * @param from Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address from, uint256 amount) external {
        uint256 currentAllowance = allowance(from, msg.sender);
        require(currentAllowance >= amount, "Burn amount exceeds allowance");
        _approve(from, msg.sender, currentAllowance - amount);
        _burn(from, amount);
    }

    /**
     * @dev Adds an address to the whitelist
     * @param account Address to whitelist
     */
    function addToWhitelist(address account) external onlyRole(ADMIN_ROLE) {
        require(account != address(0), "Cannot whitelist zero address");
        _whitelist[account] = true;
        emit AddressWhitelisted(account);
    }

    /**
     * @dev Removes an address from the whitelist
     * @param account Address to remove from whitelist
     */
    function removeFromWhitelist(address account) external onlyRole(ADMIN_ROLE) {
        _whitelist[account] = false;
        emit AddressRemovedFromWhitelist(account);
    }

    /**
     * @dev Adds an address to the blacklist
     * @param account Address to blacklist
     */
    function addToBlacklist(address account) external onlyRole(ADMIN_ROLE) {
        require(account != address(0), "Cannot blacklist zero address");
        _blacklist[account] = true;
        emit AddressBlacklisted(account);
    }

    /**
     * @dev Removes an address from the blacklist
     * @param account Address to remove from blacklist
     */
    function removeFromBlacklist(address account) external onlyRole(ADMIN_ROLE) {
        _blacklist[account] = false;
        emit AddressRemovedFromBlacklist(account);
    }

    /**
     * @dev Sets the permission mode (whitelist or blacklist)
     * @param enabled True for whitelist mode, false for blacklist mode
     */
    function setWhitelistMode(bool enabled) external onlyRole(ADMIN_ROLE) {
        whitelistMode = enabled;
        emit WhitelistModeChanged(enabled);
    }

    /**
     * @dev Checks if an address is whitelisted
     * @param account Address to check
     * @return bool True if whitelisted
     */
    function isWhitelisted(address account) public view returns (bool) {
        return _whitelist[account];
    }

    /**
     * @dev Checks if an address is blacklisted
     * @param account Address to check
     * @return bool True if blacklisted
     */
    function isBlacklisted(address account) public view returns (bool) {
        return _blacklist[account];
    }

    /**
     * @dev Checks if a transfer is allowed based on permissions
     * @param from Sender address
     * @param to Receiver address
     * @return bool True if transfer is allowed
     */
    function isTransferAllowed(address from, address to) public view returns (bool) {
        // Always allow transfers from/to zero address (mint/burn)
        if (from == address(0) || to == address(0)) {
            return true;
        }

        // Check blacklist first (always enforced)
        if (_blacklist[from] || _blacklist[to]) {
            return false;
        }

        // If whitelist mode is enabled, both parties must be whitelisted
        if (whitelistMode) {
            return _whitelist[from] && _whitelist[to];
        }

        // In blacklist mode, if not blacklisted, transfer is allowed
        return true;
    }

    /**
     * @dev Override transfer function to enforce permissions
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(isTransferAllowed(from, to), "Transfer not allowed by permissions");
        super._update(from, to, amount);
    }
}
