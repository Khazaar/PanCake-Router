// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0;
import "../contracts/access/Ownable.sol";
import "./ERC20Basic.sol";

contract ERC20LSR is ERC20Basic("Laser", "LSR"), Ownable {}
