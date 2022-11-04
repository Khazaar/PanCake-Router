import { ethers } from "hardhat";
import { address } from "hardhat/internal/core/config/config-validation";
//import { ERC20Apple__factory, ERC20Potato__factory } from "../typechain-types/"
import { PancakeFactory, ERC20Pancake__factory, PancakeFactory__factory, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory, ERC20RottenCarrot__factory, ERC20LSR__factory, PancakeRouter_mod__factory } from "../typechain-types"

async function main() {
  // Connetc to DEX
  const contractApple = await ethers.getContract("ERC20Apple");
  const contractPotato = await ethers.getContract("ERC20Potato");
  const contractLSR = await ethers.getContract("ERC20LSR");
  const contractPancake = await ethers.getContract("ERC20Pancake");
  const pancakeFactory: PancakeFactory = await ethers.getContract("PancakeFactory");

  try {
    // Create Potato-Apple pair
    await pancakeFactory.createPair(contractPotato.address, contractApple.address);
    let filter = await pancakeFactory.filters.PairCreated();
    let logs = await pancakeFactory.queryFilter(filter);
    console.log(`Pair Potato - Apple created successfully to ${logs[logs.length - 1].args.pair}`);

    // Create Potato-LSR pair
    await pancakeFactory.createPair(contractPotato.address, contractLSR.address);
    filter = await pancakeFactory.filters.PairCreated();
    logs = await pancakeFactory.queryFilter(filter);
    console.log(`Pair Potato - LSR created successfully to ${logs[logs.length - 1].args.pair}`);

    // Create LSR-Apple pair
    await pancakeFactory.createPair(contractLSR.address, contractApple.address);
    filter = await pancakeFactory.filters.PairCreated();
    logs = await pancakeFactory.queryFilter(filter);
    console.log(`Pair LSR - Apple created successfully to ${logs[logs.length - 1].args.pair}`);


    // let receipt = await tx.wait();
    // console.log(receipt.events);
    // const pair_address = await pancakeFactory.getPair(contractPotato.address, contractApple.address);
    // const pair = PancakePair__factory.connect(pair_address, owner);

    // Check factory pairs
    console.log(`Pairs created sucsesfully!`);
    //console.log(await pancakeFactory.allPairs);

  }
  catch (err) {
    console.log(err);
  };
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
