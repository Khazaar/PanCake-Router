import { ethers } from "hardhat";
import { PancakeRouter_mod } from "../typechain-types";

async function main() {
    const [owner, user1, user2, user3, user4, user5] =
        await ethers.getSigners();
    const router_mod: PancakeRouter_mod = await ethers.getContract(
        "PancakeRouter_mod"
    );
    //const accessControl: AccessControl = await ethers.getContract("AccessControl");
    const contractApple = await ethers.getContract("ERC20Apple");
    const contractPotato = await ethers.getContract("ERC20Potato");
    const contractLSR = await ethers.getContract("ERC20LSR");
    try {
        console.log(`Admin is ${await router_mod.getAdminAddress()}`);
        // SET FEE
        //await router_mod.connect(user5).setSwapFee(10);
        //await router_mod.connect(user5).setLsrMinBalance(10);
        const filter1 = await router_mod.filters.SetSwapFee();
        const logs1 = await router_mod.queryFilter(filter1);
        console.log(`Set fee:${logs1[logs1.length - 1].args._swapFee}`);
        await router_mod.connect(user5).withdrawFees(contractApple.address);
        const filter2 = await router_mod.filters.WithdrawFees();
        const logs2 = await router_mod.queryFilter(filter2);
        console.log(
            `Withdraw token ${logs2[logs2.length - 1].args._token} for ${
                logs2[logs2.length - 1].args._totalBalance
            }`
        );
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
