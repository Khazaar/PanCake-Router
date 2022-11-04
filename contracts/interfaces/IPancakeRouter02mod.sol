// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.2;

import "./IPancakeRouter01mod.sol";

interface IPancakeRouter02 is IPancakeRouter01 {
    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable;
}
