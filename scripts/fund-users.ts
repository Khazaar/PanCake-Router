import { address } from "hardhat/internal/core/config/config-validation";
//import { ERC20Apple__factory, ERC20Potato__factory } from "../typechain-types/"
import { ERC20Apple__factory, ERC20Potato__factory, ERC20LSR__factory } from "../typechain-types"
import { ContractAddress } from "./local-chain-data"
import { ethers, deployments, getNamedAccounts } from 'hardhat';
import 'hardhat-deploy-ethers';

async function main() {
  // Connetc to DEX
  const [owner, user1, user2, user3, user4] = await ethers.getSigners();
  const address0 = ethers.constants.AddressZero;
  // const contractApple = await new ERC20Apple__factory(owner).attach(ContractAddress.ERC20Apple);
  // const contractPotato = await new ERC20Potato__factory(owner).attach(ContractAddress.ERC20Potato);
  // const contractLSR = await new ERC20LSR__factory(owner).attach(ContractAddress.ERC20LSR);
  const contractApple = await ethers.getContract("ERC20Apple");
  const contractPotato = await ethers.getContract("ERC20Potato");
  const contractLSR = await ethers.getContract("ERC20LSR");

  const appleAmount = BigInt(1000000);
  const lsrAmount = BigInt(1000000);
  const potatoAmount = BigInt(2000000);

  // | User  | Role  | ALP | PTT | LSR |
  // | ----- | ----- | --- | --- | --- |
  // | user1 | admin | 10  | 0   | 0   |
  // | user2 | -     | 0   | 20  | 0   |
  // | user3 | -     | 10  | 20  | 0   |
  // | user4 | -     | 10  | 20  | 10  |

  // Fund with Apple
  await contractApple.connect(user1).getTokens(appleAmount.toString());
  await contractApple.connect(user3).getTokens(appleAmount.toString());
  await contractApple.connect(user4).getTokens(appleAmount.toString());

  //Fund with Potato
  await contractPotato.connect(user2).getTokens(potatoAmount.toString());
  await contractPotato.connect(user3).getTokens(appleAmount.toString());
  await contractPotato.connect(user4).getTokens(potatoAmount.toString());

  //Fund with LSR
  await contractLSR.connect(user4).getTokens(lsrAmount.toString());
  console.log(`Funded successfully`);



  //Approve token to router
  // await contractApple.connect(user3).approve(router.address, appleAmount.toString());
  // await contractPotato.connect(user3).approve(router.address, potatoAmount.toString());

  // Get liquidity
  // const [_reserve0, _reserve1, _blockTimestampLast] = await pair.getReserves();
  // console.log(`Reserve 1 ${_reserve0}, Reserve 2 ${_reserve1}`);


  // Add liquidity (1 apple = 2 potatos)
  // await router.connect(user3).addLiquidity(contractApple.address, contractPotato.address, 20, 20, 2, 2, user3.address, 21660493904, { gasLimit: 1000000000 });
  // console.log("Liquidity added successfully");


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
