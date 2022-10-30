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


    try {
        // Set user5 as admin
        //await router_mod.connect(owner).setAdminAddress(user5.address);
        await router_mod.connect(user5).withdrawFees(contractApple.address);


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