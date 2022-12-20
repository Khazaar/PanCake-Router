// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20.sol";
import "hardhat/console.sol";

contract ERC20Basic is ERC20 {
    mapping(address => uint256) public lastMint;
    mapping(address => uint256) public mintedInPeriod;
    uint256 public mintLimitInPeriod = 1000000;
    uint256 public  mintPeriodSeconds = 60*60*0.1; // 1 hour 
    constructor(string memory name_, string memory symbol_)
        public
        ERC20(name_, symbol_)
    {}
    event MintRevertedAmount(uint256 amount);
    event MintRevertedPeriod(uint256 timePassedSeconds);


    function getTokens(uint256 _amount) public {
        uint256 timePassedSeconds = block.timestamp - lastMint[msg.sender];
        if(timePassedSeconds <= mintPeriodSeconds){
            emit MintRevertedPeriod(timePassedSeconds);
            revert("Please wait for mint period");
        }
        if (_amount>mintLimitInPeriod) {
            emit MintRevertedAmount(_amount);
            revert("Please do not exceed mint amount");
        }
        _mint(msg.sender, _amount);
        lastMint[msg.sender] = block.timestamp;
    }

    function burnAllTokens() public {
        uint256 balance = balanceOf(msg.sender);
        console.log("Burning");
        console.log(balance);
        console.log("Tokens");

        _burn(msg.sender, balance);
    }

    function decimals() public view virtual override returns (uint8) {
        return 1;
    }
}
