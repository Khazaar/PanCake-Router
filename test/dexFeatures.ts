import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

import { PancakePair__factory } from "../typechain-types";
import { deployRouterFixture } from "./deployFixture";

describe("Dex features", () => {
    it("Add liquidity to APL-PTT pair", async () => {
        const {
            user3,
            contractApple,
            contractPotato,
            contractRouter_mod,
            pancakeFactory,
        } = await loadFixture(deployRouterFixture);
        const appleAmount = BigInt(100000);
        const potatoAmount = BigInt(100000);
        // Approve
        await contractApple.connect(user3).getTokens(appleAmount.toString());
        await contractPotato.connect(user3).getTokens(potatoAmount.toString());
        await contractApple
            .connect(user3)
            .approve(contractRouter_mod.address, appleAmount.toString());
        await contractPotato
            .connect(user3)
            .approve(contractRouter_mod.address, potatoAmount.toString());

        // Add liquidity
        const tx = await contractRouter_mod
            .connect(user3)
            .addLiquidity(
                contractApple.address,
                contractPotato.address,
                appleAmount,
                potatoAmount,
                appleAmount,
                potatoAmount,
                user3.address,
                216604939048
            );
        // Check reserves
        const pairAddress = await pancakeFactory.getPair(
            contractApple.address,
            contractPotato.address
        );

        const contractPair = PancakePair__factory.connect(pairAddress, user3);
        const [reserve0, reserve1] = await contractPair.getReserves();
        expect(reserve0).to.equal(appleAmount);
    });
    it("Swap APL to PTT", async () => {
        const {
            user1,
            user3,
            contractApple,
            contractPotato,
            contractRouter_mod,
            pancakeFactory,
        } = await loadFixture(deployRouterFixture);
        const appleLiqAmount = BigInt(100000);
        const potatoLiqAmount = BigInt(100000);
        // Get and Approve
        await contractApple.connect(user3).getTokens(appleLiqAmount.toString());
        await contractPotato
            .connect(user3)
            .getTokens(potatoLiqAmount.toString());
        await contractApple
            .connect(user3)
            .approve(contractRouter_mod.address, appleLiqAmount.toString());
        await contractPotato
            .connect(user3)
            .approve(contractRouter_mod.address, appleLiqAmount.toString());
        // Add liquidity
        let tx = await contractRouter_mod
            .connect(user3)
            .addLiquidity(
                contractApple.address,
                contractPotato.address,
                appleLiqAmount,
                potatoLiqAmount,
                appleLiqAmount,
                potatoLiqAmount,
                user3.address,
                216604939048
            );
        await tx.wait(1);

        // Get and approve to user1
        const appleSwapAmount = BigInt(10000);
        await contractApple
            .connect(user1)
            .getTokens(appleSwapAmount.toString());
        await contractApple
            .connect(user1)
            .approve(contractRouter_mod.address, appleLiqAmount.toString());
        tx = await contractRouter_mod
            .connect(user1)
            .swapExactTokensForTokens(
                appleSwapAmount,
                1,
                [contractApple.address, contractPotato.address],
                user1.address,
                216604939048
            );
        await tx.wait(1);
        const supposedSlippage = 0.1;

        expect(await contractApple.balanceOf(user1.address)).to.equal(0);
        expect(await contractPotato.balanceOf(user1.address)).to.approximately(
            appleSwapAmount,
            BigInt(
                (appleSwapAmount.toString() as unknown as number) *
                    supposedSlippage
            )
        );
    });
});
