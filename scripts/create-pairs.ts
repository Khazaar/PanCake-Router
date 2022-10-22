import { ethers } from "hardhat";
import { address } from "hardhat/internal/core/config/config-validation";
//import { ERC20Apple__factory, ERC20Potato__factory } from "../typechain-types/"
import { ERC20Pancake__factory, PancakeFactory__factory, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory, ERC20RottenCarrot__factory, ERC20LSR__factory, PancakeRouter_mod__factory } from "../typechain-types"
import { ContractAddress } from "./local-chain-data"

async function main() {
  // Connetc to DEX
  const contractApple = await ethers.getContract("ERC20Apple");
  const contractPotato = await ethers.getContract("ERC20Potato");
  const contractLSR = await ethers.getContract("ERC20LSR");
  const contractPancake = await ethers.getContract("ERC20Pancake");
  const pancakeFactory = await ethers.getContract("PancakeFactory");


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
