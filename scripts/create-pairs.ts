import { ethers } from "hardhat";
import { address } from "hardhat/internal/core/config/config-validation";
//import { ERC20Apple__factory, ERC20Potato__factory } from "../typechain-types/"
import { PancakeERC20__factory, PancakeFactory__factory, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory, ERC20RottenCarrot__factory, ERC20LSR__factory, PancakeRouter_mod__factory } from "../typechain-types"
import { ContractAddress } from "./local-chain-data"

async function main() {
  // Connetc to DEX
  const [owner, user1, user2, user3, user4] = await ethers.getSigners();
  const users = [owner, user1, user2, user3, user4];
  const contractApple = await new ERC20Apple__factory(owner).attach(ContractAddress.ERC20Apple);
  const contractPotato = await new ERC20Potato__factory(owner).attach(ContractAddress.ERC20Potato);
  const contractLSR = await new ERC20LSR__factory(owner).attach(ContractAddress.ERC20LSR);
  const pancakeERC20 = await new PancakeERC20__factory(owner).attach(ContractAddress.PancakePair);
  const pancakeFactory = await new PancakeFactory__factory(owner).attach(ContractAddress.PancakeFactory);
  const router_mod = await new PancakeRouter_mod__factory(owner).attach(ContractAddress.PancakeRouter_mod);

  // Create Potato-Apple pair
  let tx1 = await pancakeFactory.createPair(contractPotato.address, contractApple.address);
  //console.log(`Pair created successfully to ${pancakeFactory.address}`);

  let tx2 = await pancakeFactory.createPair(contractPotato.address, contractLSR.address);
  //console.log(`Pair created successfully to ${pancakeFactory.address}`);

  let tx3 = await pancakeFactory.createPair(contractLSR.address, contractApple.address);

  // let receipt = await tx.wait();
  // console.log(receipt.events);
  // const pair_address = await pancakeFactory.getPair(contractPotato.address, contractApple.address);
  // const pair = PancakePair__factory.connect(pair_address, owner);

  // Check factory pairs
  console.log(`Pairs created sucsesfully!`);
  //console.log(await pancakeFactory.allPairs);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
