// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
import "../contracts/access/Ownable.sol";
import "./ERC20Basic.sol";

contract ERC20RottenCarrot is ERC20Basic("RottenCarrot", "RTC"), Ownable {}
