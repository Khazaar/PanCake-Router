import { ethers } from "hardhat";
import {
    ERC20LSR,
    ERC20Apple,
    ERC20Potato,
    ERC20Tomato,
    ERC20Basic,
} from "../typechain-types";

async function main() {
    const [owner, user1, user2, user3, user4, user5] =
        await ethers.getSigners();

    const contractApple: ERC20Basic = await ethers.getContract("ERC20Apple");
    const contractPotato: ERC20Basic = await ethers.getContract("ERC20Potato");
    const contractTomato: ERC20Basic = await ethers.getContract("ERC20Tomato");
    const contractLSR: ERC20Basic = await ethers.getContract("ERC20LSR");

    //  Setup
    const token = contractApple;
    const mintLimitAmount = BigInt(1000000);
    const mintLimitPeriodSeconds = BigInt(1);
    const usr = owner;
    try {
        console.log(
            `Mint Limit Amount is ${await token.getMintLimitAmount()}, Mint Limit Period Seconds is ${await token.getMintLimitPeriodSeconds()}`
        );

        //  Set Mint Limit Amount
        await token.connect(usr).setMintLimitAmount(mintLimitAmount);
        const filterAmount = await token.filters.MintLimitAmountSet();
        const logsAmount = await token.queryFilter(filterAmount);
        console.log(
            `Set Mint Limit Amount: ${
                logsAmount[logsAmount.length - 1].args.mintLimitAmount
            }`
        );

        //  Set Mint Limit Period Seconds
        await token
            .connect(usr)
            .setMintLimitPeriodSeconds(mintLimitPeriodSeconds);
        const filterPeriod = await token.filters.MintLimitPeriodSecondsSet();
        const logsPeriod = await token.queryFilter(filterPeriod);
        console.log(
            `Set Mint Limit Period Seconds: ${
                logsPeriod[logsPeriod.length - 1].args.mintLimitPeriodSeconds
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
