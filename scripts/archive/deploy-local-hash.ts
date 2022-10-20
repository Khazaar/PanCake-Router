import { ethers } from "hardhat";
import { address } from "hardhat/internal/core/config/config-validation";
//import { ERC20Apple__factory, ERC20Potato__factory } from "../typechain-types/"
import { PancakeERC20__factory, PancakeFactory, PancakeFactory__factory, PancakePair__factory, PancakePair, PancakeRouter, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory } from "../typechain-types"

async function main() {

  const [owner, user1, user2, user3] = await ethers.getSigners();
  const address0 = ethers.constants.AddressZero;

  const contractApple = await new ERC20Apple__factory(owner).deploy();
  console.log(`Apple contract deployed to ${await contractApple.address}`);
  const contractPotato = await new ERC20Potato__factory(owner).deploy();
  console.log(`Potato contract deployed to ${await contractPotato.address}`);

  const pancakeERC20 = await new PancakeERC20__factory(owner).deploy();
  console.log(`PancakeERC20 contract deployed to ${await pancakeERC20.address}`);

  // Deploy factory
  const pancakeFactory = await new PancakeFactory__factory(owner).deploy(ethers.constants.AddressZero);
  console.log(`Factory deployed successfully to ${pancakeFactory.address}`);

  // //Deploy router
  // const router = await new PancakeRouter__factory(owner).deploy(pancakeFactory.address, ethers.constants.AddressZero);
  // console.log(`Router deployed successfully to ${router.address}`);

  console.log(`Hash is ${await pancakeFactory.INIT_CODE_PAIR_HASH()}`);



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
