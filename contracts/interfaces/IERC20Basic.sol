// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.5.0;
import "./IERC20.sol";

interface IERC20Basic is IERC20 {
    event MintRevertedAmount(uint256 indexed askedAmount, uint256 indexed mintLimitAmount);
    event MintRevertedPeriod(uint256 indexed timePassedSeconds, uint256 indexed mintLimitPeriodSeconds);
    event MintLimitAmountSet(uint256 indexed mintLimitAmount);
    event MintLimitPeriodSecondsSet(uint256 indexed mintLimitPeriodSeconds);

    function setMintLimitAmount(uint256 mintLimitAmount) external ;
    function getMintLimitAmount() external view returns(uint256); 
    function setMintLimitPeriodSeconds(uint256 mintLimitPeriodSeconds) external;
    function getMintLimitPeriodSeconds() external view returns(uint256); 
    function getTokens(uint256 askedAmount) external; 
    function burnAllTokens() external; 

}