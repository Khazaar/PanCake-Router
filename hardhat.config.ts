import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy-tenderly";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "hardhat-contract-sizer";
import "@nomiclabs/hardhat-etherscan";
import "solidity-coverage";

const {
    MNEMONIC,
    bscscanApiKey,
    ALCHEMY_API_KEY_GOERLI,
    ALCHEMY_API_KEY_SEPOLIA,
    GOERLI_PRIVATE_KEY,
    etherscanApiKey,
} = require("./secrets.json");

//import "@tenderly/hardhat-tenderly";
// tdly.setup({
//   automaticVerifications: false
// });

task("accounts", "Prints the list of accounts").setAction(async (args, hre) => {
    const tokenId = Number(args.id);
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
        let bl = hre.ethers.utils.formatEther(await account.getBalance());
        console.log(`${account.address}: ${bl}`);
    }
});

task("verifys", "Verifys contracts").setAction(
    async (_args, { ethers, run }) => {
        await run("verify", {
            address: "0xF3B0Bf3cdC24ae7d9FC7Df08B98E2a3d30071b8f",
            contract: "contracts/ERC20Apple.sol:ERC20Apple",
        });
        await run("verify", {
            address: "0xF8E133c6B4bC73d89723B138E0654AeaAD11Bd21",
            contract: "contracts/ERC20LSR.sol:ERC20LSR",
        });
        await run("verify", {
            address: "0xac3849A6d4b0a97eC86998F6e0cC531D66F5Fa82",
            contract: "contracts/ERC20Tomato.sol:ERC20Tomato",
        });
        await run("verify", {
            address: "0x4075B23f1D93e99439eC078BB3E59712FE19B53A",
            contract: "contracts/ERC20Potato.sol:ERC20Potato",
        });
        await run("verify", {
            address: "0xfA85901DBeB559EBA2d15bdc1c9EdfC14D880cAC",
            contract: "contracts/PancakeFactory.sol:PancakeFactory",
            constructorArgsParams: [`${ethers.constants.AddressZero}`],
        });
        await run("verify", {
            address: "0xf1f8c1B19e56f34220B2eef5B19a15c2DF504f5F",
            contract: "contracts/PancakeRouter_mod.sol:PancakeRouter_mod",
            constructorArgsParams: [
                `0xfA85901DBeB559EBA2d15bdc1c9EdfC14D880cAC`,
                `${ethers.constants.AddressZero}`,
                `0xF8E133c6B4bC73d89723B138E0654AeaAD11Bd21`,
            ],
        });
    }
);

task("testDEX", "Deploy, fund, add liq").setAction(
    async (_args, { ethers, run }) => {
        await run("run", { script: "scripts/fund-users.ts" });
        await run("run", { script: "scripts/create-pairs.ts" });
        await run("run", { script: "scripts/add-liquidityUNV.ts" });
        await run("run", { script: "scripts/swapUNV.ts" });
        await run("run", { script: "scripts/dex-status.ts" });
    }
);

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            allowUnlimitedContractSize: true,
            blockGasLimit: 1245000000,
            chainId: 31337,
            loggingEnabled: false,
        },
        local: {
            url: "http://127.0.0.1:8545",
            loggingEnabled: false,
        },
        BSCTestnet: {
            url: "https://data-seed-prebsc-1-s1.binance.org:8545",
            chainId: 97,
            gasPrice: 20000000000,
            accounts: { mnemonic: MNEMONIC },
            timeout: 1000000,
        },

        goerli: {
            url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY_GOERLI}`,
            accounts: { mnemonic: MNEMONIC },
        },

        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY_SEPOLIA}`,
            accounts: { mnemonic: MNEMONIC },
        },
    },
    solidity: {
        compilers: [
            { version: "0.5.16" },
            { version: "0.6.6" },
            { version: "0.8.0" },
            { version: "0.8.4" },
            { version: "0.4.18" },
        ],
        settings: {
            optimizer: {
                enabled: true,
                runs: 10000,
            },
        },
    },
    namedAccounts: {
        deployer: 0,
    },

    tenderly: {
        project: "PSRouter",
        username: "Khazaar",
    },
    etherscan: {
        apiKey: etherscanApiKey,
    },
};

export default config;
