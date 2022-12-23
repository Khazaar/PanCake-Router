// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./ERC20.sol";
import "hardhat/console.sol";

contract ERC20Basic is ERC20 {
    mapping(address => uint256) public lastMint;
    mapping(address => uint256) public mintedInPeriod;
    uint256 public mintLimitAmount = 1000000;
    uint256 public  mintLimitPeriodSeconds = 600;//60*60*0.01; // 1 hour 
    constructor(string memory name_, string memory symbol_)
        public
        ERC20(name_, symbol_)
    {}
    event MintRevertedAmount(uint256 indexed askedAmount, uint256 indexed mintLimitAmount);
    event MintRevertedPeriod(uint256 indexed timePassedSeconds, uint256 indexed mintLimitPeriodSeconds);

    function getTokens(uint256 askedAmount) public {
        uint256 timePassedSeconds = block.timestamp - lastMint[msg.sender];
        require(askedAmount<=mintLimitAmount,"Please do not exceed mint amount");
        if(timePassedSeconds <= mintLimitPeriodSeconds){
            emit MintRevertedPeriod(timePassedSeconds,mintLimitPeriodSeconds);
            console.log("Please wait for mint period");
        }
        else {
             _mint(msg.sender, askedAmount);
                lastMint[msg.sender] = block.timestamp;
            }
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
