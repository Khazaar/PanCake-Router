//import "@tenderly/hardhat-tenderly";
import { ethers } from "hardhat";

import { ERC20LSR__factory, ERC20Pancake__factory, PancakeFactory__factory, PancakePair__factory, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter_mod__factory } from "../typechain-types"
import { ERC20Apple, ERC20Potato, ERC20LSR, ERC20Pancake, PancakeRouter_mod, PancakeFactory, PancakePair } from "../typechain-types"

import { ContractAddress } from "./local-chain-data"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
//const hre = require("@nomiclabs/hardhat");



async function main() {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const users = [owner, user1, user2, user3, user4];
    const contractApple: ERC20Apple = await ethers.getContract("ERC20Apple");
    const contractPotato: ERC20Potato = await ethers.getContract("ERC20Potato");
    const contractLSR: ERC20LSR = await ethers.getContract("ERC20LSR");
    const contractPancake: ERC20Pancake = await ethers.getContract("ERC20Pancake");
    const pancakeFactory: PancakeFactory = await ethers.getContract("PancakeFactory");
    const router_mod: PancakeRouter_mod = await ethers.getContract("PancakeRouter_mod");

    //await hre.tenderly.persistArtifacts(contractApple, contractApple, router_mod);

    const appleAmount = BigInt(100000);
    const lsrAmount = BigInt(200000);

    //Approve transfer
    let tx = await contractApple.connect(user3).approve(router_mod.address, appleAmount.toString());
    let receipt = await tx.wait(1);
    //console.log(`Allowance is ${await contractApple.connect(user3).allowance(user3.address, router_mod.address)}`);
    //console.log(receipt);
    tx = await contractLSR.connect(user3).approve(router_mod.address, lsrAmount.toString());
    receipt = await tx.wait(1);
    console.log(`Allowance is ${await contractLSR.connect(user3).allowance(user3.address, router_mod.address)}`);

    //Add liquidity

    tx = await router_mod.connect(user3).addLiquidity(
        contractApple.address, contractLSR.address,
        appleAmount, 100000,
        appleAmount * BigInt(1), 100000,
        user1.address, 216604939048);

    const pairAddress = await pancakeFactory.getPair(contractApple.address, contractLSR.address);
    const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);

    let liqAmount = (await pair.balanceOf(user1.address)).toBigInt();//: BigInt = (await pair.balanceOf(user3.address)).toBigInt();

    console.log(`Liq tokens: ${liqAmount}`);

    // const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
    // const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);
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