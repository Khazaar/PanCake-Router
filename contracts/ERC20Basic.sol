// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
import "./ERC20.sol";
import "hardhat/console.sol";
import "./access/AccessControlEnumerable.sol";

contract ERC20Basic is ERC20 ,AccessControlEnumerable {
    mapping(address => uint256) public lastMint;
    mapping(address => uint256) public mintedInPeriod;
    uint256 private _mintLimitAmount;
    uint256 private  _mintLimitPeriodSeconds;
    bytes32 public constant OWNER_ROLE = keccak256(abi.encodePacked("OWNER"));
    constructor(string memory name_, string memory symbol_)
        public
        ERC20(name_, symbol_)
    {
        _setupRole(OWNER_ROLE, msg.sender);
        setMintLimitAmount(1000000);
        //60*60*0.01; // 1 hour 
        setMintLimitPeriodSeconds(600);
    }
    
    event MintRevertedAmount(uint256 indexed askedAmount, uint256 indexed mintLimitAmount);
    event MintRevertedPeriod(uint256 indexed timePassedSeconds, uint256 indexed mintLimitPeriodSeconds);
    event MintLimitAmountSet(uint256 indexed mintLimitAmount);
    event MintLimitPeriodSecondsSet(uint256 indexed mintLimitPeriodSeconds);

     function setMintLimitAmount(uint256 mintLimitAmount) public {
        require(hasRole(OWNER_ROLE, msg.sender), "Adress is not owner");
        _mintLimitAmount = mintLimitAmount;
        emit MintLimitAmountSet(_mintLimitAmount);
    }

    function getMintLimitAmount() public view returns(uint256) {
        return( _mintLimitAmount);
    }

    function setMintLimitPeriodSeconds(uint256 mintLimitPeriodSeconds) public{
        require(hasRole(OWNER_ROLE, msg.sender), "Adress is not owner");
        _mintLimitPeriodSeconds = mintLimitPeriodSeconds;
        MintLimitPeriodSecondsSet(_mintLimitPeriodSeconds);
    }

    function getMintLimitPeriodSeconds() public view returns(uint256) {
        return(_mintLimitPeriodSeconds);
    }

    function getTokens(uint256 askedAmount) public {
        uint256 timePassedSeconds = block.timestamp - lastMint[msg.sender];
        require(askedAmount<=_mintLimitAmount,"Please do not exceed mint amount");
        if(timePassedSeconds <= _mintLimitPeriodSeconds){
            emit MintRevertedPeriod(timePassedSeconds,_mintLimitPeriodSeconds);
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
        return 3;
    }
}
