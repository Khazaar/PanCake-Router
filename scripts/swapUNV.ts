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

    //const hash1 = await pancakeFactory.INIT_CODE_PAIR_HASH();
    try {
        // SETUP
        const usr = user2;
        const tokenA = "ERC20Apple";
        const tokenB = "ERC20LSR";
        const swapAAmount = BigInt(10000).toString();
        const contractA = await ethers.getContract(tokenA);
        const contractB = await ethers.getContract(tokenB);

        const pairAddress = await pancakeFactory.getPair(contractB.address, contractA.address);
        const pair: PancakePair = new PancakePair__factory(owner).attach(pairAddress);
        console.log(`Pair address: ${pairAddress.toString()}`);

        let [reserve0, reserve1, time] = await pair.getReserves();
        console.log(`Reserves before swap are: ${reserve0.toString()}, ${reserve1.toString()}`);

        const expectedAmnt = await router_mod.getAmountOut(swapAAmount, reserve0, reserve1);
        console.log(`Expecting to get ${expectedAmnt} tokens`);

        await router_mod.connect(usr).swapExactTokensForTokens(swapAAmount, 1,
            [contractA.address, contractB.address], usr.address,
            99999999999999);

        let filter = await pair.filters.Swap();
        let logs = await pair.queryFilter(filter);
        console.log(`Sender  ${logs[logs.length - 1].args.sender}, amount0In ${logs[logs.length - 1].args.amount0In}, 
        amount1In ${logs[logs.length - 1].args.amount1In}, amount0Out ${logs[logs.length - 1].args.amount0Out}, 
        amount1Out ${logs[logs.length - 1].args.amount1Out}, to ${logs[logs.length - 1].args.to}`);

        [reserve0, reserve1, time] = await pair.getReserves();
        console.log(`Reserves after swap are: ${reserve0.toString()}, ${reserve1.toString()}`);

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