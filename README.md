## General information

This Hardhat project is a fork of Uniswap v2 DEX with a modified router - a bundle of DEX smart contracts and ERC20 tokens (/contracts), and hardhat scripts to deploy(/deploy), verify them and interact with them (/scripts). Typescript bindings for DEX smart contracts are generated with typechain and stored in /typechain-types. Tests are stored in /test folders.

To spin up the local blockchain node and deploy DEX smart contracts run:
hh node
hh run scripts/deploy.ts --network localhost

To perform tests on the local blockchain node run:
hh test

## Advanced router features

Modifications comparing with source Uniswap (Pancakeswap) DEX smart contracts are:

-   Users with native DEX token (LSR) don't pay a trading fee;
-   PancakeRouter_mod smart contract can have an Admin, who can set the transfer fee, withdraw the transfer fee set the required LSR amount to avoid paying a trading fee;
-   Admin role could be assigned or revoked by the Owner;

There are 4 ERC20 smart contracts (ERC20Apple, ERC20Potato, ERC20Tomato, and ERC20LSR), which can be minted to test DEX features for free with some limitations - munt amount and mint period, which can be set by router Owner.

Supported networks are Sepolia, BSC Testnet, Hardhat Local.

Web interface for this DEX (another of my React Web3 frond-end project) could be found here: https://master.d2vryayadfjwli.amplifyapp.com/
