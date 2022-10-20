## Project instructions

0. Run node         `hh node`
1. Deploy contracts `hh run scripts/deploy-contracts.ts --network localhost`
2. Fund users       `hh run scripts/fund-users.ts --network localhost`
3. Create pairs     `hh run scripts/create-pairs.ts --network localhost`
4. Check DEX status `hh run scripts/dex-status.ts --network localhost`
4. Add Liquidity    `hh run scripts/add-liquidity.ts --network localhost`
5. Trade

hh run scripts/deploy-fixture.ts --network localhost



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