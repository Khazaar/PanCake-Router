// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
import "../contracts/access/Ownable.sol";
import "./ERC20Basic.sol";

contract ERC20Tomato is ERC20Basic("Tomato", "TMT"), Ownable {}
