import { PancakeRouter_mod } from "../typechain-types";
import { ethers } from "hardhat";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

async function main() {
    // Connetc to DEX
    const [owner, user1, user2, user3, user4, user5] =
        await ethers.getSigners();
    const users = [owner, user1, user2, user3, user4, user5];

    const contractApple = await ethers.getContract("ERC20Apple");
    const contractPotato = await ethers.getContract("ERC20Potato");
    const contractTomato = await ethers.getContract("ERC20Tomato");
    const contractLSR = await ethers.getContract("ERC20LSR");
    const router_mod: PancakeRouter_mod = await ethers.getContract(
        "PancakeRouter_mod"
    );
    //@todo

    const appleAmount = BigInt(1000000);
    const lsrAmount = BigInt(1000000);
    const potatoAmount = BigInt(1000000);
    const tomatoAmount = BigInt(1000000);

    // Fund with Apple
    await contractApple.connect(user1).getTokens(appleAmount.toString());
    await contractApple.connect(user2).getTokens(appleAmount.toString());
    await contractApple.connect(user3).getTokens(appleAmount.toString());
    await contractApple.connect(owner).getTokens(appleAmount.toString());

    //Fund with Potato
    //await contractPotato.connect(user2).getTokens(potatoAmount.toString());
    await contractPotato.connect(user3).getTokens(potatoAmount.toString());
    //await contractPotato.connect(user4).getTokens(potatoAmount.toString());

    //Fund with LSR
    await contractLSR.connect(owner).getTokens(lsrAmount.toString());
    await contractLSR.connect(user3).getTokens(lsrAmount.toString());

    //Fund with Tomato
    await contractTomato.connect(owner).getTokens(tomatoAmount.toString());
    await contractTomato.connect(user2).getTokens(tomatoAmount.toString());
    await contractTomato.connect(user3).getTokens(tomatoAmount.toString());

    console.log(`Funded successfully`);

    for (const usr of users) {
        await contractApple
            .connect(usr)
            .approve(router_mod.address, 9999999999999);
        await contractPotato
            .connect(usr)
            .approve(router_mod.address, 9999999999999);
        await contractLSR
            .connect(usr)
            .approve(router_mod.address, 9999999999999);
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
