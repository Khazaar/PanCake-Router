import {
    PancakeRouter_mod,
    ERC20LSR,
    ERC20Apple,
    ERC20Potato,
    ERC20Tomato,
    ERC20Basic,
} from "../typechain-types";
import { ethers } from "hardhat";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";

interface IFundUser {
    usr: SignerWithAddress;
    amnt: BigInt;
}

function fundUsers(token: ERC20Basic, fundUsers: IFundUser[]): void {
    const mintLimitAmount = BigInt(1000000);
    fundUsers.forEach(async (fundUsr) => {
        try {
            const tx = await token
                .connect(fundUsr.usr)
                .getTokens(fundUsr.amnt.toString());
            const receipt = await tx.wait();
            let filterAmount = token.filters.MintRevertedAmount();
            if (receipt.events != undefined) {
                const timePassedSeconds =
                    receipt.events[0].args?.timePassedSeconds;
                if (timePassedSeconds != undefined) {
                    console.log(`Passed only ${timePassedSeconds} seconds`);
                }
            }

            // let filterPeriod = token.filters.MintRevertedPeriod();
            // let logsPeriod = await token.queryFilter(filterPeriod);
            // try {
            //     console.log(
            //         `Mint reverted due to requested amount. Requested ${
            //             logsAmount[logsAmount.length - 1].args?.askedAmount
            //         }, limit ${
            //             logsAmount[logsAmount.length - 1].args?.mintLimitAmount
            //         }`
            //     );
            // } catch {}
            // try {
            //     console.log(
            //         `Mint reverted due to requested amount. Passed ${
            //             logsPeriod[logsPeriod.length - 1].args.timePassedSeconds
            //         }, limit ${
            //             logsPeriod[logsPeriod.length - 1].args
            //                 .mintLimitPeriodSeconds
            //         }`
            //     );
        } catch (err) {
            console.log(err);
        }
    });
}

async function main() {
    // Connetc to DEX
    const [owner, user1, user2, user3, user4, user5] =
        await ethers.getSigners();
    const users = [owner, user1, user2, user3, user4, user5];

    const contractApple: ERC20Basic = await ethers.getContract("ERC20Apple");
    const contractPotato: ERC20Basic = await ethers.getContract("ERC20Potato");
    const contractTomato: ERC20Basic = await ethers.getContract("ERC20Tomato");
    const contractLSR: ERC20Basic = await ethers.getContract("ERC20LSR");
    const router_mod: PancakeRouter_mod = await ethers.getContract(
        "PancakeRouter_mod"
    );

    // Fund with Apple
    fundUsers(contractApple, [
        { usr: owner, amnt: BigInt(1000000) },
        { usr: user1, amnt: BigInt(1000000) },
        { usr: user2, amnt: BigInt(1000000) },
    ]);

    //Fund with Potato
    fundUsers(contractPotato, [
        { usr: owner, amnt: BigInt(1000000) },
        { usr: user1, amnt: BigInt(1000000) },
    ]);

    //Fund with Tomato
    fundUsers(contractTomato, [
        { usr: owner, amnt: BigInt(1000000) },
        { usr: user1, amnt: BigInt(1000000) },
    ]);

    //Fund with LSR
    fundUsers(contractLSR, [
        { usr: owner, amnt: BigInt(1000000) },
        { usr: user1, amnt: BigInt(1000000) },
        { usr: user3, amnt: BigInt(1000000) },
    ]);

    console.log(`Funded successfully`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
