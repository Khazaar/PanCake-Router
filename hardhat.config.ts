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
    ALCHEMY_API_KEY,
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
        // await run("verify", {
        //     address: "0x2757E1767543dCeC9C76ed128d3f8e86d2f3901B",
        //     contract: "contracts/ERC20Apple.sol:ERC20Apple",
        // });
        // await run("verify", {
        //     address: "0xe0B81076Fa915a280f03bFb746A4F5873578E287",
        //     contract: "contracts/ERC20LSR.sol:ERC20LSR",
        // });
        // await run("verify", {
        //     address: "0x0A41D46f01A8A9EeBdEc130c9a926aFc4a97B6dE",
        //     contract: "contracts/ERC20Tomato.sol:ERC20Tomato",
        // });
        // // await run("verify", {
        // //     address: "0xE73a67F72b94c13fEc798D54a90d0A277DD16E71",
        // //     contract: "contracts/ERC20Pancake.sol:ERC20Pancake",
        // // });
        // await run("verify", {
        //     address: "0x54C569b56fbf38C8AC9942b7011a3653e5073FD4",
        //     contract: "contracts/ERC20Potato.sol:ERC20Potato",
        // });
        // await run("verify", {
        //     address: "0xB48475F43de9BF5Fcd2fce228F74F9B5F80E73F6",
        //     contract: "contracts/PancakeFactory.sol:PancakeFactory",
        //     constructorArgsParams: [`${ethers.constants.AddressZero}`],
        // });
        // // await run("verify", {
        // //     address: "0xEaa96e643d817D7DE691D8992d7535aaD458c6DD",
        // //     contract: "contracts/PancakePair.sol:PancakePair",
        // // });

        await run("verify", {
            address: "0x7d29E9366C3022F30a8fd72ef59CaC95BC9e8B72",
            contract: "contracts/PancakeRouter_mod.sol:PancakeRouter_mod",
            constructorArgsParams: [
                `0xB48475F43de9BF5Fcd2fce228F74F9B5F80E73F6`,
                `${ethers.constants.AddressZero}`,
                `0xe0B81076Fa915a280f03bFb746A4F5873578E287`,
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
    //defaultNetwork: "localhost",
    defaultNetwork: "hardhat",
    //chainId: 31337,
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
        mainnet: {
            url: "https://bsc-dataseed.binance.org/",
            chainId: 56,
            gasPrice: 20000000000,
            accounts: { mnemonic: MNEMONIC },
        },
        goerli: {
            url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
            gasPrice: 20000000000,
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
