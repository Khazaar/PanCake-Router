import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { tenderly } from "hardhat";
import { ERC20Pancake__factory, PancakeFactory__factory, PancakePair__factory, PancakeRouter, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory } from "../typechain-types"
import { AccessControl, ERC20Apple, ERC20Potato, ERC20LSR, ERC20Pancake, PancakeRouter_mod, PancakeFactory, PancakePair } from "../typechain-types"

async function main() {
    const [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();
    const router_mod: PancakeRouter_mod = await ethers.getContract("PancakeRouter_mod");
    //const accessControl: AccessControl = await ethers.getContract("AccessControl");
    const contractApple = await ethers.getContract("ERC20Apple");
    const contractPotato = await ethers.getContract("ERC20Potato");
    const contractLSR = await ethers.getContract("ERC20LSR");

    //await router_mod.connect(owner).setAdminAddress(user5.address);
    //const hash1 = await pancakeFactory.INIT_CODE_PAIR_HASH();
    try {
        console.log(`Admin is ${await router_mod.getAdminAddress()}`)
        //let tx = await router_mod.connect(owner).setAdminAddress(user4.address);

        // SET FEE
        //await router_mod.connect(user5).setSwapFee(10);
        //await router_mod.connect(user5).setLsrMinBalance(10);
        const filter1 = await router_mod.filters.SetSwapFee();
        const logs1 = await router_mod.queryFilter(filter1);
        console.log(`Set fee:${logs1[logs1.length - 1].args._swapFee}`);
        await router_mod.connect(user5).withdrawFees(contractApple.address);
        const filter2 = await router_mod.filters.WithdrawFees();
        const logs2 = await router_mod.queryFilter(filter2);
        console.log(`Withdraw token ${logs2[logs2.length - 1].args._token} for ${logs2[logs2.length - 1].args._totalBalance}`);

        // let filter = router_mod.filters.RoleGranted();
        // let logs = await router_mod.queryFilter(filter);

        //console.log(`role: ${logs[logs.length - 1].args[0]} account: ${logs[logs.length - 1].args[1]} sender: ${logs[logs.length - 1].args[2]}`);

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