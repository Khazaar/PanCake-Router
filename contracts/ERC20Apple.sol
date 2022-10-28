// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
//mport "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";
import "../contracts/access/Ownable.sol";
import "./ERC20Basic.sol";

contract ERC20Apple is ERC20Basic("Apple", "APL"), Ownable {}
