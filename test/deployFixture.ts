import { ethers } from "hardhat";
import { run } from "hardhat";

import {
    PancakeFactory,
    PancakeRouter_mod,
    ERC20Apple,
    ERC20Potato,
    ERC20LSR,
} from "../typechain-types";
export const deployRouterFixture = async () => {
    await run("deploy");
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const users = [owner, user1, user2, user3, user4];
    const contractApple: ERC20Apple = await ethers.getContract("ERC20Apple");
    const contractPotato: ERC20Potato = await ethers.getContract("ERC20Potato");
    const contractLSR: ERC20LSR = await ethers.getContract("ERC20LSR");
    const pancakeFactory: PancakeFactory = await ethers.getContract(
        "PancakeFactory"
    );
    const contractRouter_mod: PancakeRouter_mod = await ethers.getContract(
        "PancakeRouter_mod"
    );

    return {
        owner,
        user1,
        user2,
        user3,
        contractApple,
        contractPotato,
        contractRouter_mod,
        pancakeFactory,
    };
};
