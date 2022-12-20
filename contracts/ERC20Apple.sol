// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
import "../contracts/access/Ownable.sol";
import "./ERC20Basic.sol";

contract ERC20Apple is ERC20Basic("Apple", "APL"), Ownable {}
