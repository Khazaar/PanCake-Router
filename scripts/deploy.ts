import { ethers } from "hardhat";
import { address } from "hardhat/internal/core/config/config-validation";
//import { ERC20Apple__factory, ERC20Potato__factory } from "../typechain-types/"
import { PancakeFactory, PancakeFactory__factory, PancakePair__factory, PancakePair, PancakeRouter, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory } from "../typechain-types/"

async function main() {
  const [owner, user1, user2, user3] = await ethers.getSigners();
  const address0 = ethers.constants.AddressZero; //ethers.utils.getAddress("0x0000000000000000000000000000000000000000");

  const contractApple = await new ERC20Apple__factory(owner).deploy();
  console.log(`Apple contract deployed to ${await contractApple.address}`);
  const contractPotato = await new ERC20Potato__factory(owner).deploy();
  console.log(`Potato contract deployed to ${await contractPotato.address}`);

  const appleAmount = BigInt(10);
  const potatoAmount = BigInt(20);

  //user 1 is an Apple owner
  await contractApple.connect(user1).getTokens(appleAmount.toString());
  //user 2 is a Potato owner
  await contractPotato.connect(user2).getTokens(potatoAmount.toString());
  //user 3 is both Apple and Potato owner (he provides liquidity)
  await contractApple.connect(user3).getTokens(appleAmount.toString());
  await contractPotato.connect(user3).getTokens(potatoAmount.toString());

  console.log("BALANCES");
  console.log(`User 1 balance: Apple ${await contractApple.balanceOf(user1.address)} Potato ${await contractPotato.balanceOf(user1.address)}`);
  console.log(`User 2 balance: Apple ${await contractApple.balanceOf(user2.address)} Potato ${await contractPotato.balanceOf(user2.address)}`);
  console.log(`User 3 balance: Apple ${await contractApple.balanceOf(user3.address)} Potato ${await contractPotato.balanceOf(user3.address)}`);


  // Deploy factory
  const pancakeFactory = await new PancakeFactory__factory(owner).deploy(address0);
  await pancakeFactory.deployTransaction.wait(1);
  console.log(`Factory deployed successfully to ${pancakeFactory.address}}`);

  // Create pair
  let tx = await pancakeFactory.createPair(contractPotato.address, contractApple.address);
  console.log(`Pair created successfully to ${pancakeFactory.address}`);
  let receipt = await tx.wait();
  console.log(receipt.events);
  const pair_address = await pancakeFactory.getPair(contractPotato.address, contractApple.address);
  const pair = PancakePair__factory.connect(pair_address, owner);


  // Check factory pairs
  console.log("Router pairs:");
  //console.log(await pancakeFactory.allPairs);

  // Deploy router
  const router = await new PancakeRouter__factory(owner).deploy(pancakeFactory.address, address0);

  let tx2 = await router.deployTransaction;


  console.log(`Router deployed at ${router.address}`);

  //Approve token to router
  await contractApple.connect(user3).approve(router.address, appleAmount.toString());
  await contractPotato.connect(user3).approve(router.address, potatoAmount.toString());

  // Get liquidity
  const [_reserve0, _reserve1, _blockTimestampLast] = await pair.getReserves();
  console.log(`Reserve 1 ${_reserve0}, Reserve 2 ${_reserve1}`);


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
