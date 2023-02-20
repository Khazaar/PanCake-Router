import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployRouterFixture } from "./deployFixture";
import { ethers } from "hardhat";
const ADMIN_ROLE = ethers.utils.solidityKeccak256(["string"], ["ADMIN"]);

describe("Admin features", () => {
    it("Set admin address successful", async () => {
        const { owner, user1, contractRouter_mod } = await loadFixture(
            deployRouterFixture
        );
        await contractRouter_mod.connect(owner).setAdminAddress(user1.address);
        expect(await contractRouter_mod.getAdminAddress()).to.equal(
            user1.address
        );
    });
    it("Set 2 more admins", async () => {
        const { owner, user1, user2, user3, contractRouter_mod } =
            await loadFixture(deployRouterFixture);
        await contractRouter_mod.connect(owner).setAdminAddress(user1.address);
        await contractRouter_mod.connect(owner).setAdminAddress(user2.address);

        const minterCount = await contractRouter_mod.getRoleMemberCount(
            ADMIN_ROLE
        );
        expect(minterCount).to.equal(BigInt(3));
    });
    it("Revoke admin", async () => {
        const { owner, user1, user2, user3, contractRouter_mod } =
            await loadFixture(deployRouterFixture);
        await contractRouter_mod.connect(owner).setAdminAddress(user1.address);
        await contractRouter_mod
            .connect(owner)
            .revokeAdminAddress(user1.address);

        const minterCount = await contractRouter_mod.getRoleMemberCount(
            ADMIN_ROLE
        );
        expect(minterCount).to.equal(BigInt(1));
    });
    it("Try set admin without owner role", async () => {
        const { user1, user2, contractRouter_mod } = await loadFixture(
            deployRouterFixture
        );
        await contractRouter_mod.setAdminAddress(user1.address);
        const swapFee = 10; // divide by 10000
        let errMessage: string = "";
        try {
            await contractRouter_mod
                .connect(user2)
                .setAdminAddress(user1.address);
        } catch (error) {
            errMessage = (error as Error).message;
            //console.log(errMessage);
        }
        expect(errMessage).to.equal(
            "VM Exception while processing transaction: reverted with reason string 'AccessControl: account 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc is missing role 0x6270edb7c868f86fda4adedba75108201087268ea345934db8bad688e1feb91b'"
        );
    });
    it("Set fee successful", async () => {
        const { user1, contractRouter_mod } = await loadFixture(
            deployRouterFixture
        );
        await contractRouter_mod.setAdminAddress(user1.address);
        const swapFee = 10; // divide by 10000
        await contractRouter_mod.connect(user1).setSwapFee(swapFee);
        expect(await contractRouter_mod.connect(user1).getSwapFee()).to.equal(
            swapFee
        );
    });
    it("Set LSR Min balance successful", async () => {
        const { user1, contractRouter_mod } = await loadFixture(
            deployRouterFixture
        );
        await contractRouter_mod.setAdminAddress(user1.address);
        const lsrMinBalance = 10; // divide by 10000
        await contractRouter_mod.connect(user1).setLsrMinBalance(lsrMinBalance);
        expect(
            await contractRouter_mod.connect(user1).getLsrMinBalance()
        ).to.equal(lsrMinBalance);
    });
    it("Try set fee without admin roles", async () => {
        const { owner, user1, user2, contractRouter_mod } = await loadFixture(
            deployRouterFixture
        );
        //await contractRouter_mod.setAdminAddress(user1.address);
        const swapFee = 10; // divide by 10000
        let errMessage: string = "";
        try {
            await contractRouter_mod.connect(user1).setSwapFee(swapFee);
        } catch (error) {
            errMessage = (error as Error).message;
            console.log("WAITING", errMessage);
        }
        expect(errMessage).to.equal(
            "VM Exception while processing transaction: reverted with reason string 'Prohibited for non admins'"
        );
    });
    it("Withdraw swap fee", async () => {
        const {
            owner,
            user1,
            user2,
            user3,
            contractApple,
            contractPotato,
            contractRouter_mod,
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

        // Set user1 as admin
        await contractRouter_mod.connect(owner).setAdminAddress(user1.address);
        const swapFee = 10; // divide by 10000
        await contractRouter_mod.connect(user1).setSwapFee(swapFee);

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

        // Get and approve to user2
        const appleSwapAmount = BigInt(10000);
        await contractApple
            .connect(user2)
            .getTokens(appleSwapAmount.toString());
        await contractApple
            .connect(user2)
            .approve(contractRouter_mod.address, appleLiqAmount.toString());
        tx = await contractRouter_mod
            .connect(user2)
            .swapExactTokensForTokens(
                appleSwapAmount,
                1,
                [contractApple.address, contractPotato.address],
                user2.address,
                216604939048
            );
        await tx.wait(1);
        tx = await contractRouter_mod
            .connect(user1)
            .withdrawFees(contractApple.address);
        const feeWithdrawn = await contractApple.balanceOf(user1.address);
        expect(feeWithdrawn).to.equal(
            BigInt(
                ((appleSwapAmount.toString() as unknown as number) * swapFee) /
                    10000
            )
        );
    });
});
