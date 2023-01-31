//import "@tenderly/hardhat-tenderly";
import { ethers } from "hardhat";
import { PancakePair__factory } from "../typechain-types";
import {
    ERC20Apple,
    ERC20Potato,
    ERC20LSR,
    ERC20Pancake,
    PancakeRouter_mod,
    PancakeFactory,
    PancakePair,
} from "../typechain-types";
//const hre = require("@nomiclabs/hardhat");

async function main() {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const users = [owner, user1, user2, user3, user4];
    const contractApple: ERC20Apple = await ethers.getContract("ERC20Apple");
    const contractPotato: ERC20Potato = await ethers.getContract("ERC20Potato");
    const contractLSR: ERC20LSR = await ethers.getContract("ERC20LSR");
    const contractPancake: ERC20Pancake = await ethers.getContract(
        "ERC20Pancake"
    );
    const pancakeFactory: PancakeFactory = await ethers.getContract(
        "PancakeFactory"
    );
    const router_mod: PancakeRouter_mod = await ethers.getContract(
        "PancakeRouter_mod"
    );

    //await hre.tenderly.persistArtifacts(contractApple, contractApple, router_mod);

    // SETUP
    const usr = user3;
    const tokenA = "ERC20Apple";
    const tokenB = "ERC20LSR";
    const addReservesA = BigInt(100000).toString();
    const addReservesB = BigInt(2000).toString();

    //Add liquidity
    const contractA = await ethers.getContract(tokenA);
    const contractB = await ethers.getContract(tokenB);

    await router_mod
        .connect(usr)
        .addLiquidity(
            contractA.address,
            contractB.address,
            addReservesA,
            addReservesB,
            0,
            0,
            usr.address,
            216604939048
        );

    const pairAddress = await pancakeFactory.getPair(
        contractA.address,
        contractB.address
    );
    const pair: PancakePair = new PancakePair__factory(owner).attach(
        pairAddress
    );

    let filter = pair.filters.Mint();
    let logs = await pair.queryFilter(filter);
    console.log(
        `Mint: Sender  ${logs[logs.length - 1].args.sender}, amount0 ${
            logs[logs.length - 1].args.amount0
        }, amount1 ${logs[logs.length - 1].args.amount1}`
    );

    const [reserve0, reserve1, time] = await pair.getReserves();
    console.log(`Reserves are: ${reserve0.toString()}, ${reserve1.toString()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
