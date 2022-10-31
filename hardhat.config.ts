import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers"
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy-tenderly";
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import { task } from "hardhat/config";
import '@nomiclabs/hardhat-ethers';


const { mnemonic } = require('./secrets.json');

//import "@tenderly/hardhat-tenderly";
// tdly.setup({
//   automaticVerifications: false
// });

task("accounts", "Prints the list of accounts")
  .setAction(async (args, hre) => {
    const tokenId = Number(args.id)
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
      console.log(account.address);
    }
  });

task("prepare", "Deploy, fund, add liq").setAction(
  async (_args, { ethers, run }) => {
    await run("run", { script: "scripts/fund-users.ts" });
    await run("run", { script: "scripts/add-liquidity.ts" });
    await run("run", { script: "scripts/swap.ts" });
    await run("run", { script: "scripts/dex-status.ts" });

  }
);

const config: HardhatUserConfig = {
  //defaultNetwork: "localhost",
  defaultNetwork: "hardhat",

  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 1245000000,
      chainId: 31337,
    },
    local: {
      url: 'http://127.0.0.1:8545'

    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: { mnemonic: mnemonic },
      timeout: 1000000
    },
    mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: { mnemonic: mnemonic }
    }

  },
  solidity: {
    compilers: [
      { version: "0.5.16", },
      { version: "0.6.6", },
      { version: "0.8.0", },
      { version: "0.8.4", },
      { version: "0.4.18", },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 10000
      }
    }
  },
  namedAccounts: {
    deployer: 0,
  },

  tenderly: {
    project: 'PSRouter',
    username: 'Khazaar',
  },
};



export default config;
