import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { ethers } from "hardhat";
import { ERC20LSR__factory, PancakeERC20__factory, PancakeFactory, PancakeFactory__factory, PancakePair__factory, PancakePair, PancakeRouter, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter_mod__factory } from "../typechain-types"
import { ContractAddress } from "./local-chain-data"

async function main() {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const users = [owner, user1, user2, user3, user4];
    const contractApple = await new ERC20Apple__factory(owner).attach(ContractAddress.ERC20Apple);
    const contractPotato = await new ERC20Potato__factory(owner).attach(ContractAddress.ERC20Potato);
    const contractLSR = await new ERC20LSR__factory(owner).attach(ContractAddress.ERC20LSR);
    const pancakeERC20 = await new PancakeERC20__factory(owner).attach(ContractAddress.PancakePair);
    const pancakeFactory = await new PancakeFactory__factory(owner).attach(ContractAddress.PancakeFactory);
    const router_mod = await new PancakeRouter_mod__factory(owner).attach(ContractAddress.PancakeRouter_mod);


    //const hash1 = await pancakeFactory.INIT_CODE_PAIR_HASH();
    //console.log(`Hash is ${hash1}`);

    // User 3 adds liquidity to APL\PTT pool with ratio 1:2

    //contractPotato.balanceOf(usr.address)

    const appleAmount = BigInt(1000000)//: BigInt = (await contractApple.balanceOf(user3.address)).toBigInt();
    const potatoAmount = BigInt(2000000)//: BigInt = (await contractPotato.balanceOf(user3.address)).toBigInt();


    await contractApple.connect(user3).getTokens(appleAmount.toString());
    await contractPotato.connect(user3).getTokens(potatoAmount.toString());
    await contractApple.connect(user3).approve(router_mod.address, appleAmount.toString());
    await contractPotato.connect(user3).approve(router_mod.address, potatoAmount.toString());

    // Add liquidity
    const tx = await router_mod.connect(user3).addLiquidity(contractApple.address, contractPotato.address, appleAmount,
        appleAmount, potatoAmount, potatoAmount, user3.address, 216604939048);



    const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
    const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// function addLiquidity(
//     address tokenA,
//     address tokenB,
//     uint amountADesired,
//     uint amountBDesired,
//     uint amountAMin,
//     uint amountBMin,
//     address to,
//     uint deadline
//   ) 