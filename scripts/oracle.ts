import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { tenderly } from "hardhat";
import { ExampleOracleSimple__factory, ERC20Pancake__factory, PancakeFactory__factory, PancakePair__factory, PancakeRouter, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory } from "../typechain-types"
import { ExampleOracleSimple, ERC20Apple, ERC20Potato, ERC20LSR, ERC20Pancake, PancakeRouter_mod, PancakeFactory, PancakePair } from "../typechain-types"

async function main() {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const users = [owner, user1, user2, user3, user4];
    const contractApple: ERC20Apple = await ethers.getContract("ERC20Apple");
    const contractPotato: ERC20Potato = await ethers.getContract("ERC20Potato");
    const contractLSR: ERC20LSR = await ethers.getContract("ERC20LSR");
    const contractPancake: ERC20Pancake = await ethers.getContract("ERC20Pancake");
    const pancakeFactory: PancakeFactory = await ethers.getContract("PancakeFactory");
    const router_mod: PancakeRouter_mod = await ethers.getContract("PancakeRouter_mod");
    //const ExampleOracleSimple: ExampleOracleSimple = await ethers.getContract("ExampleOracleSimple");

    // Deploy oracle
    const exampleOracleSimple = await new ExampleOracleSimple__factory(owner).deploy(pancakeFactory.address, contractApple.address, contractPotato.address);
    console.log(`Oracle deployed at ${exampleOracleSimple.address}`);

    //const hash1 = await pancakeFactory.INIT_CODE_PAIR_HASH();
    try {
        await exampleOracleSimple.update();
        const amnt = await exampleOracleSimple.consult(contractApple.address, 1000);
        console.log(amnt.toString());
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