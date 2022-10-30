import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { tenderly } from "hardhat";
import { ERC20Pancake__factory, PancakeFactory__factory, PancakePair__factory, PancakeRouter, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory } from "../typechain-types"
import { ERC20Apple, ERC20Potato, ERC20LSR, ERC20Pancake, PancakeRouter_mod, PancakeFactory, PancakePair } from "../typechain-types"

async function main() {
    const [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();
    const contractApple: ERC20Apple = await ethers.getContract("ERC20Apple");
    const contractPotato: ERC20Potato = await ethers.getContract("ERC20Potato");
    const contractLSR: ERC20LSR = await ethers.getContract("ERC20LSR");
    const contractPancake: ERC20Pancake = await ethers.getContract("ERC20Pancake");
    const pancakeFactory: PancakeFactory = await ethers.getContract("PancakeFactory");
    const router_mod: PancakeRouter_mod = await ethers.getContract("PancakeRouter_mod");
    //await router_mod.connect(owner).setAdminAddress(user5.address);



    //const hash1 = await pancakeFactory.INIT_CODE_PAIR_HASH();
    try {
        const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
        const pair: PancakePair = new PancakePair__factory(owner).attach(pairAddress);

        const [reserve0, reserve1, time] = await pair.getReserves();
        console.log(`Reserves are: ${reserve0.toString()}, ${reserve1.toString()}`);
        //console.log(`Cumulative prices is: ${await pair.price0CumulativeLast()}`);

        const appleAmount = BigInt(20000);
        const potatoAmount = BigInt(2000);

        await contractApple.connect(user4).approve(router_mod.address, appleAmount.toString());
        await contractPotato.connect(user4).approve(router_mod.address, potatoAmount.toString());
        await contractApple.connect(user2).approve(router_mod.address, appleAmount.toString());
        await contractPotato.connect(user2).approve(router_mod.address, potatoAmount.toString());

        const expectedAmnt = await router_mod.getAmountOut(appleAmount, reserve0, reserve1);
        console.log(`Expecting to get ${expectedAmnt} tokens`);

        router_mod.connect(user5).setSwapFee(10); // set Fee * 10000
        router_mod.connect(user5).setLsrMinBalance(100000000); // to avoid fees


        await router_mod.connect(user2).swapExactTokensForTokens(appleAmount, 10,
            [contractApple.address, contractPotato.address], user2.address,
            99999999999999);

        await router_mod.connect(user4).swapExactTokensForTokens(appleAmount, 10,
            [contractApple.address, contractPotato.address], user4.address,
            99999999999999);
    }
    catch (err) {
        console.log(err);
    }

}





// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});