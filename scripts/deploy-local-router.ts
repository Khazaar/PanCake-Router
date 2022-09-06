import { ethers } from "hardhat";
import { address } from "hardhat/internal/core/config/config-validation";
//import { ERC20Apple__factory, ERC20Potato__factory } from "../typechain-types/"
import { PancakeERC20__factory, PancakeFactory, PancakeFactory__factory, PancakePair__factory, PancakePair, PancakeRouter, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory } from "../typechain-types"

async function main() {

  const [owner, user1, user2, user3] = await ethers.getSigners();

  // Attach factory
  const factoryContractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
  //const pancakeFactory = await new PancakeFactory__factory(owner).attach(factoryContractAddress);

  //Deploy router
  const router = await new PancakeRouter__factory(owner).deploy(factoryContractAddress, ethers.constants.AddressZero);
  console.log(`Router deployed successfully to ${router.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
