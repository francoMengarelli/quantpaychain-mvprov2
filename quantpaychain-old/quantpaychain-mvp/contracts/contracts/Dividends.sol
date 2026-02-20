
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./PermissionedToken.sol";

/**
 * @title Dividends
 * @dev Contract for distributing dividends to token holders
 * @notice This contract allows depositing ETH as dividends and claiming proportional shares
 */
contract Dividends is Ownable, ReentrancyGuard {
    PermissionedToken public token;

    // Dividend tracking
    uint256 public totalDividendsDeposited;
    uint256 public totalDividendsClaimed;
    uint256 public dividendsPerTokenStored;
    
    // User dividend tracking
    mapping(address => uint256) public userDividendsPerTokenPaid;
    mapping(address => uint256) public userDividendsClaimed;
    
    // Snapshot of token balances at deposit time
    mapping(address => uint256) public lastBalanceSnapshot;
    uint256 public lastTotalSupplySnapshot;

    // Events
    event DividendsDeposited(address indexed depositor, uint256 amount, uint256 timestamp);
    event DividendsClaimed(address indexed holder, uint256 amount, uint256 timestamp);
    event TokenUpdated(address indexed newToken);

    /**
     * @dev Constructor that sets the token contract
     * @param _token Address of the PermissionedToken contract
     */
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Token address cannot be zero");
        token = PermissionedToken(_token);
        lastTotalSupplySnapshot = token.totalSupply();
    }

    /**
     * @dev Deposits ETH as dividends to be distributed to token holders
     * @notice Anyone can deposit dividends, proportionally distributed to all token holders
     */
    function deposit() external payable {
        require(msg.value > 0, "Must deposit more than 0");
        
        uint256 totalSupply = token.totalSupply();
        require(totalSupply > 0, "No tokens in circulation");

        // Update dividends per token
        uint256 dividendsPerToken = (msg.value * 1e18) / totalSupply;
        dividendsPerTokenStored += dividendsPerToken;
        
        totalDividendsDeposited += msg.value;
        lastTotalSupplySnapshot = totalSupply;

        emit DividendsDeposited(msg.sender, msg.value, block.timestamp);
    }

    /**
     * @dev Claims accumulated dividends for the caller
     * @notice Calculates and transfers the caller's share of dividends
     */
    function claim() external nonReentrant {
        uint256 dividends = calculateDividends(msg.sender);
        require(dividends > 0, "No dividends to claim");

        // Update user's claimed dividends tracking
        userDividendsPerTokenPaid[msg.sender] = dividendsPerTokenStored;
        userDividendsClaimed[msg.sender] += dividends;
        totalDividendsClaimed += dividends;

        // Update balance snapshot
        lastBalanceSnapshot[msg.sender] = token.balanceOf(msg.sender);

        // Transfer dividends
        (bool success, ) = payable(msg.sender).call{value: dividends}("");
        require(success, "Dividend transfer failed");

        emit DividendsClaimed(msg.sender, dividends, block.timestamp);
    }

    /**
     * @dev Calculates unclaimed dividends for a specific holder
     * @param holder Address of the token holder
     * @return uint256 Amount of unclaimed dividends in wei
     */
    function calculateDividends(address holder) public view returns (uint256) {
        uint256 balance = token.balanceOf(holder);
        if (balance == 0) {
            return 0;
        }

        // Calculate dividends based on balance and dividends per token
        uint256 dividendsPerTokenDelta = dividendsPerTokenStored - userDividendsPerTokenPaid[holder];
        uint256 dividends = (balance * dividendsPerTokenDelta) / 1e18;

        return dividends;
    }

    /**
     * @dev Returns the total unclaimed dividends available in the contract
     * @return uint256 Amount of unclaimed dividends
     */
    function getUnclaimedDividends() external view returns (uint256) {
        return totalDividendsDeposited - totalDividendsClaimed;
    }

    /**
     * @dev Returns dividend information for a specific holder
     * @param holder Address of the token holder
     * @return balance Current token balance
     * @return claimable Claimable dividend amount
     * @return claimed Total claimed dividends
     */
    function getDividendInfo(address holder) external view returns (
        uint256 balance,
        uint256 claimable,
        uint256 claimed
    ) {
        balance = token.balanceOf(holder);
        claimable = calculateDividends(holder);
        claimed = userDividendsClaimed[holder];
    }

    /**
     * @dev Updates the token contract address (only owner)
     * @param _token New token contract address
     */
    function updateToken(address _token) external onlyOwner {
        require(_token != address(0), "Token address cannot be zero");
        token = PermissionedToken(_token);
        lastTotalSupplySnapshot = token.totalSupply();
        emit TokenUpdated(_token);
    }

    /**
     * @dev Returns the contract's ETH balance
     * @return uint256 Contract balance in wei
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Allows the contract to receive ETH directly
     */
    receive() external payable {
        if (msg.value > 0) {
            uint256 totalSupply = token.totalSupply();
            if (totalSupply > 0) {
                uint256 dividendsPerToken = (msg.value * 1e18) / totalSupply;
                dividendsPerTokenStored += dividendsPerToken;
                totalDividendsDeposited += msg.value;
                lastTotalSupplySnapshot = totalSupply;
                emit DividendsDeposited(msg.sender, msg.value, block.timestamp);
            }
        }
    }
}
