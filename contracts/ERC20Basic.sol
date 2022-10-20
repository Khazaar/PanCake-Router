// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract ERC20Basic is ERC20 {
    constructor(string memory name_, string memory symbol_)
        ERC20(name_, symbol_)
    {}

    function getTokens(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }

    function burnAllTokens() public {
        uint256 balance = balanceOf(msg.sender);
        console.log("Burning");
        console.log(balance);
        console.log("Tokens");

        //address someAddress = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        _burn(msg.sender, balance);

        // if (balance > 0) {
        //     transfer(someAddress, balance);
        // }
    }

    function decimals() public view virtual override returns (uint8) {
        return 1;
    }
}
