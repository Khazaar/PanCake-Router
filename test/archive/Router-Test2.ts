// import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
// import { expect } from "chai";
// import { ethers } from "hardhat";
// //import { hre } from "hardhat";
// import { tenderly } from "hardhat";

// import { PancakeERC20__factory, PancakeFactory, PancakeFactory__factory, PancakePair__factory, PancakePair, PancakeRouter, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory } from "../typechain-types"

// describe("Router test", function () {

//   async function deployRouterFixture() {

//     const appleContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
//     const potatoContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
//     const pancakeERC20ContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
//     const factoryContractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
//     const routerContractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

//     const [owner, user1, user2, user3] = await ethers.getSigners();
//     const users = [owner, user1, user2, user3]
//     const address0 = ethers.constants.AddressZero;

//     const contractApple = await new ERC20Apple__factory(owner).attach(appleContractAddress);
//     //console.log(`Apple contract deployed to ${await contractApple.address}`);
//     const contractPotato = await new ERC20Potato__factory(owner).attach(potatoContractAddress);
//     //console.log(`Potato contract deployed to ${await contractPotato.address}`);

//     const pancakeERC20 = await new PancakeERC20__factory(owner).attach(pancakeERC20ContractAddress);
//     //console.log(`PancakeERC20 contract deployed to ${await pancakeERC20.address}`);

//     // Deploy factory
//     const pancakeFactory = await new PancakeFactory__factory(owner).attach(factoryContractAddress);
//     //console.log(`Factory deployed successfully to ${pancakeFactory.address}`);

//     //Deploy router
//     const router = await new PancakeRouter__factory(owner).attach(routerContractAddress);

//     // Create pair

//     // await pancakeFactory.createPair(contractApple.address, contractPotato.address);
//     // const pairAddress = await (pancakeFactory.getPair(contractApple.address, contractPotato.address));
//     // const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);
//     //Check and replace hash

//     //Burn all current tokens

//     console.log("Liquiduty is:")
//     const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
//     const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);
//     const liqAmount = await pair.balanceOf(user3.address);
//     // Remove liquidity
//     //await router.removeLiquidity(contractApple.address, contractPotato.address, liqAmount, 1, 1, ethers.constants.AddressZero, 99999999999999)

//     //await contractApple.connect(user1).burnAllTokens();

//     for await (const usr of users) {
//       await contractApple.connect(usr).burnAllTokens();
//       await contractPotato.connect(usr).burnAllTokens();
//       // console.log("Balances:");
//       // console.log(await contractApple.connect(usr).balanceOf(usr.address));
//       // console.log(await contractPotato.connect(usr).balanceOf(usr.address));

//     }
//     //await contractPotato.connect(user2).burnAllTokens();

//     const hash1 = await pancakeFactory.INIT_CODE_PAIR_HASH();
//     console.log(`Hash is ${hash1}`);
//     return { owner, user1, user2, user3, contractApple, contractPotato, pancakeERC20, router, pancakeFactory };
//   };

//   describe.skip("Fund Users", function () {
//     it("Fund user 1 with apple", async function () {
//       const { owner, user1, user2, user3, contractApple, contractPotato } = await loadFixture(deployRouterFixture);
//       const appleAmount = BigInt(10);
//       await contractApple.connect(user1).getTokens(appleAmount.toString());
//       expect(await contractApple.balanceOf(user1.address)).to.equal(appleAmount);
//     });

//     it("Fund user 2 with potato", async function () {
//       const { owner, user1, user2, user3, contractApple, contractPotato } = await loadFixture(deployRouterFixture);
//       const potatoAmount = BigInt(20);
//       await contractPotato.connect(user2).getTokens(potatoAmount.toString());
//       expect(await contractPotato.balanceOf(user2.address)).to.equal(potatoAmount);
//     });

//     it("Fund user 3 with apple and potato", async function () {
//       const { owner, user1, user2, user3, contractApple, contractPotato } = await loadFixture(deployRouterFixture);
//       const appleAmount = BigInt(10);
//       const potatoAmount = BigInt(20);
//       console.log(`User 3 apple  balance: ${await contractApple.balanceOf(user3.address)}`)
//       await contractPotato.connect(user3).getTokens(potatoAmount.toString());
//       await contractApple.connect(user3).getTokens(appleAmount.toString());
//       expect(await contractApple.balanceOf(user3.address)).to.equal(appleAmount);
//       //expect(await contractPotato.balanceOf(user3.address)).to.equal(potatoAmount);

//     });

//   });

//   describe.skip("Transfer tokens", function () {
//     it("Transfer 1 apple from user1 to user2", async function () {
//       const { owner, user1, user2, user3, contractApple, contractPotato } = await loadFixture(deployRouterFixture);
//       const appleAmount = BigInt(10);
//       await contractApple.connect(user1).getTokens(appleAmount.toString());

//       const appleToTransfer = BigInt(1);
//       const tx = await contractApple.connect(user1).transfer(user2.address, appleToTransfer);
//       console.log(tx.hash);
//       expect(await contractApple.balanceOf(user1.address)).to.equal(appleAmount - appleToTransfer);
//       expect(await contractApple.balanceOf(user2.address)).to.equal(appleToTransfer);

//     });

//   },
//   )
//   describe("Liquidity Test", function () {

//     it("Add liquidity to APL-PTT pair", async function () {
//       const { owner, user1, user2, user3, contractApple, contractPotato, pancakeERC20, router, pancakeFactory } = await loadFixture(deployRouterFixture);
//       const appleAmount = BigInt(1000000);
//       const potatoAmount = BigInt(2000000);
//       await contractApple.connect(user3).getTokens(appleAmount.toString());
//       await contractPotato.connect(user3).getTokens(potatoAmount.toString());
//       await contractApple.connect(user3).approve(router.address, appleAmount.toString());
//       await contractPotato.connect(user3).approve(router.address, potatoAmount.toString());

//       // Check allowance
//       console.log("Allowances are:")
//       console.log(await contractApple.allowance(user3.address, router.address));
//       console.log(await contractPotato.allowance(user3.address, router.address));

//       // Add liquidity
//       const tx = await router.connect(user3).addLiquidity(contractApple.address, contractPotato.address, appleAmount, potatoAmount, appleAmount, potatoAmount, user3.address, 216604939048);
//       console.log("BALANCES");
//       console.log(`User 3 balance: Apple ${await contractApple.balanceOf(user3.address)} Potato ${await contractPotato.balanceOf(user3.address)}`);

//       // Get event
//       // const rc = await tx.wait(); // 0ms, as tx is already confirmed
//       // const event = rc.events?.find(event => event.event === 'Transfer');
//       // const filter = pancakeERC20.filters.Transfer(null);
//       // const result = await pancakeERC20.queryFilter(filter); // TypedEvent<>
//       // console.log("Info from event:");
//       // console.log(result[0]);
//       // console.log(result[1]);
//       // console.log(result[2]);

//       // Check liquidity
//       const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
//       const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);
//       console.log("Liquiduty is:");
//       let liqAmount = (await pair.balanceOf(user3.address)).toBigInt();//: BigInt = (await pair.balanceOf(user3.address)).toBigInt();
//       console.log(`Liq befor: ${liqAmount}`);
//       await router.removeLiquidity(contractApple.address, contractPotato.address, (10000).toString(), 1, 1, user1.address, 99999999999999)

//       liqAmount = (await pair.balanceOf(user3.address)).toBigInt();
//       console.log(`Liq after: ${liqAmount}`);

//     });

//   },
//   )
//   describe.skip("Trade test", function () {

//     it("Trade Apple to Potato", async function () {
//       const { owner, user1, user2, user3, contractApple, contractPotato, pancakeERC20, router, pancakeFactory } = await loadFixture(deployRouterFixture);

//       //Fund User 3
//       const appleAmount = 10000000000;
//       const potatoAmount = 20000000000;
//       await contractApple.connect(user3).getTokens(appleAmount.toString());
//       await contractPotato.connect(user3).getTokens(potatoAmount.toString());
//       await contractApple.connect(user3).approve(router.address, appleAmount.toString());
//       await contractPotato.connect(user3).approve(router.address, potatoAmount.toString());

//       await contractApple.connect(user3).approve(router.address, appleAmount.toString());
//       await contractPotato.connect(user3).approve(router.address, potatoAmount.toString());
//       // Add liquidity
//       //const tx = await router.connect(user3).addLiquidity(contractApple.address, contractPotato.address, appleAmount, potatoAmount, appleAmount, potatoAmount, user3.address, 216604939048);

//       // Fund user 1 with apple
//       await contractApple.connect(user1).getTokens(appleAmount.toString());
//       await contractApple.connect(user1).approve(router.address, appleAmount.toString());

//       const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
//       const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);

//       const [reserve0, reserve1, time] = await pair.getReserves();
//       console.log("Reserves are:")
//       console.log(reserve0);
//       console.log(reserve1);

//       console.log("Balances before :");
//       console.log(await contractApple.connect(user1).balanceOf(user1.address));
//       console.log(await contractPotato.connect(user1).balanceOf(user1.address));
//       //await router.connect(user1).swapExactTokensForTokens(appleAmount, (appleAmount * 0.01).toString(), [contractApple.address, contractPotato.address], user1.address, 216604939048);
//       console.log("Balances after:");
//       console.log(await contractApple.connect(user1).balanceOf(user1.address));
//       console.log(await contractPotato.connect(user1).balanceOf(user1.address));

//       // console.log(tx.hash);

//     });

//   },
//   )
// }
// );

// // What is reserves and what is balances???
