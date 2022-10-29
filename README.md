## With hardhat-deploy plugin
## TASKS ##
hh prepare --network localhost

0. Run node and deploy
hh node
1. Fund users
hh run scripts/fund-users.ts --network localhost
2. Check DEX status
hh run scripts/dex-status.ts --network localhost
3. Create pairs
hh run scripts/create-pairs.ts --network localhost
4. Add Liquidity
hh run scripts/add-liquidity.ts --network localhost
5. Swap
hh run scripts/swap.ts --network localhost
6. Call oracle
hh run scripts/oracle.ts --network localhost


## Project instructions

0. Run node         `hh node`
1. Deploy contracts `hh run scripts/deploy-contracts.ts --network localhost`
2. Fund users       `hh run scripts/fund-users.ts --network localhost`
3. Create pairs     `hh run scripts/create-pairs.ts --network localhost`
4. Check DEX status `hh run scripts/dex-status.ts --network localhost`
4. Add Liquidity    `hh run scripts/add-liquidity.ts --network localhost`
5. Trade

hh run scripts/fund-users.ts --network hardhat


# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
//"hardhat-deploy-ethers": "^0.3.0-beta.13"



  namedAccounts: {
    deployer: 0,
  },
  paths: {
    sources: 'src',
  }

https://github.com/wighawag/hardhat-deploy-test-uniswap/tree/main/deploy

await hre.network.provider.send("debug_traceTransaction",["0x48c03b9c304f5e99e5bb18c4a7020c1f6b9f8e8d313daf1c9fec42ba71e33930",])

debug_traceBlockByNumber

{"method": "debug_traceBlockByNumber", "params": [number, {}]}