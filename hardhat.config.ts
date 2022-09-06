import { HardhatUserConfig } from "hardhat/config";
import { task } from "hardhat/config";
import { subtask } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as tdly from "@tenderly/hardhat-tenderly";
import { run } from "hardhat";

tdly.setup();
tdly.setup({
  automaticVerifications: false
});

// task("t", "Runs temporary script", async () => {
//   //run("hh run scripts/temp.ts");
//   await run("help");
// });



const config: HardhatUserConfig = {
  defaultNetwork: "localhost",

  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 1245000000,
      chainId: 31337,
    },
    local: {
      url: 'http://127.0.0.1:8545'
    }
  },
  solidity: {
    compilers: [
      { version: "0.5.16", },
      { version: "0.6.6", },
      { version: "0.8.0", },
      { version: "0.8.4", },
      { version: "0.4.18", },

    ]
  },
};

export default config;
