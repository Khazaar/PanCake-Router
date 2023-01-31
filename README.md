This project is a fork of Uniswap v2 DEX with modified router - a bundle of DEX smart contracts and ERC20 tokens (/contracts), and hardhat scripts to deploy(/deploy), verify them and interract wuth them (/scripts).
Modifications comparing with source Uniswap (Pancakeswap) DEX smartcontracts are:

-   Users with native DEX toren (LSR) don't pay trading fee;
-   PancakeRouter_mod smartcontract has an admin, who is able to set transfer fee, withdraw transfer fee set required LSR amount to avoid payinf trading fee;

There are 4 ERC20 smatrcontracts(ERC20Apple, ERC20Potato, ERC20Tomato and ERC20LSR), with can be minted for free with some limitations to test DEX features.

Supported networks are: Goerli, BSC Testnet, Hardhat Local.

## Project instructions

0. Run node and deploy
   hh node
1. Fund users
   hh run scripts/fund-users.ts --network localhost
2. Check DEX status
   hh run scripts/dex-status.ts --network localhost
3. Create pairs (non nececery)
   hh run scripts/create-pairs.ts --network localhost
4. Add Liquidity
   hh run scripts/add-liquidityUNV.ts --network localhost
5. Swap
   hh run scripts/swapUNV.ts --network localhost
6. Call oracle
   hh run scripts/oracle.ts --network localhost
7. Withdraw fees
   hh run scripts/withdrawFees.ts --network localhost
8. Manage admin
   hh run scripts/manage-admin.ts --network localhost
9. Manage mint conditions
   hh run scripts/manage-mint-conditions.ts --network localhost

Web inetface for this DEX (another my Angular Web3 frondend project) could be found here: https://master.dbnd0fh0jij.amplifyapp.com/
