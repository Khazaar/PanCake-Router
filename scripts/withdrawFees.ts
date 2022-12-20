import { ethers } from "hardhat";
import { ERC20Apple, PancakeRouter_mod } from "../typechain-types";

async function main() {
    const [owner, user1, user2, user3, user4, user5] =
        await ethers.getSigners();
    const contractApple: ERC20Apple = await ethers.getContract("ERC20Apple");

    const router_mod: PancakeRouter_mod = await ethers.getContract(
        "PancakeRouter_mod"
    );

    try {
        // Set user5 as admin
        //await router_mod.connect(owner).setAdminAddress(user5.address);
        await router_mod.connect(user5).withdrawFees(contractApple.address);
    } catch (err) {
        console.log(err);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
