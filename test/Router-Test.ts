import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { run } from "hardhat";

import {
    PancakeFactory,
    PancakePair__factory,
    PancakePair,
    PancakeRouter_mod,
    ERC20Apple,
    ERC20Potato,
    ERC20LSR,
} from "../typechain-types";

describe("Router test", function () {
    async function deployRouterFixture() {
        await run("deploy");
        const [owner, user1, user2, user3, user4] = await ethers.getSigners();
        const users = [owner, user1, user2, user3, user4];
        const contractApple: ERC20Apple = await ethers.getContract(
            "ERC20Apple"
        );
        const contractPotato: ERC20Potato = await ethers.getContract(
            "ERC20Potato"
        );
        const contractLSR: ERC20LSR = await ethers.getContract("ERC20LSR");
        const contractPancake: PancakePair = await ethers.getContract(
            "ERC20Pancake"
        );
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
            contractPancake,
            contractRouter_mod,
            pancakeFactory,
        };
    }

    describe("ERC20 features", function () {
        it("Fund user1 with apple", async () => {
            const { user1, contractApple } = await loadFixture(
                deployRouterFixture
            );
            const appleAmount = BigInt(10);
            await contractApple
                .connect(user1)
                .getTokens(appleAmount.toString());
            expect(await contractApple.balanceOf(user1.address)).to.equal(
                appleAmount
            );
        });

        it("Fund user2 with potato", async () => {
            const { user2, contractPotato } = await loadFixture(
                deployRouterFixture
            );
            const potatoAmount = BigInt(20);
            await contractPotato
                .connect(user2)
                .getTokens(potatoAmount.toString());
            expect(await contractPotato.balanceOf(user2.address)).to.equal(
                potatoAmount
            );
        });

        it("Fund user3 with apple and potato", async () => {
            const { user3, contractApple, contractPotato } = await loadFixture(
                deployRouterFixture
            );
            const appleAmount = BigInt(10);
            const potatoAmount = BigInt(20);
            await contractPotato
                .connect(user3)
                .getTokens(potatoAmount.toString());
            await contractApple
                .connect(user3)
                .getTokens(appleAmount.toString());
            expect(await contractApple.balanceOf(user3.address)).to.equal(
                appleAmount
            );
            expect(await contractPotato.balanceOf(user3.address)).to.equal(
                potatoAmount
            );
        });
        it("Transfer 1 apple from user1 to user2", async () => {
            const { user1, user2, contractApple } = await loadFixture(
                deployRouterFixture
            );
            const appleAmount = BigInt(10);
            await contractApple
                .connect(user1)
                .getTokens(appleAmount.toString());

            const appleToTransfer = BigInt(1);
            const tx = await contractApple
                .connect(user1)
                .transfer(user2.address, appleToTransfer);
            expect(await contractApple.balanceOf(user1.address)).to.equal(
                appleAmount - appleToTransfer
            );
            expect(await contractApple.balanceOf(user2.address)).to.equal(
                appleToTransfer
            );
        });
    });

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
            await contractApple
                .connect(user3)
                .getTokens(appleAmount.toString());
            await contractPotato
                .connect(user3)
                .getTokens(potatoAmount.toString());
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

            const contractPair = PancakePair__factory.connect(
                pairAddress,
                user3
            );
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
            await contractApple
                .connect(user3)
                .getTokens(appleLiqAmount.toString());
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
            expect(
                await contractPotato.balanceOf(user1.address)
            ).to.approximately(
                appleSwapAmount,
                BigInt(
                    (appleSwapAmount.toString() as unknown as number) *
                        supposedSlippage
                )
            );
        });
    });

    describe("Admin features", () => {
        it("Set admin address successful", async () => {
            const { owner, user1, contractRouter_mod } = await loadFixture(
                deployRouterFixture
            );
            await contractRouter_mod
                .connect(owner)
                .setAdminAddress(user1.address);
            expect(await contractRouter_mod.getAdminAddress()).to.equal(
                user1.address
            );
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
                console.log(errMessage);
            }
            expect(errMessage).to.equal(
                "VM Exception while processing transaction: reverted with reason string 'Prohibited for non owner'"
            );
        });

        it("Set fee successful", async () => {
            const { user1, contractRouter_mod } = await loadFixture(
                deployRouterFixture
            );
            await contractRouter_mod.setAdminAddress(user1.address);
            const swapFee = 10; // divide by 10000
            await contractRouter_mod.connect(user1).setSwapFee(swapFee);
            expect(
                await contractRouter_mod.connect(user1).getSwapFee()
            ).to.equal(swapFee);
        });

        it("Set LSR Min balance successful", async () => {
            const { user1, contractRouter_mod } = await loadFixture(
                deployRouterFixture
            );
            await contractRouter_mod.setAdminAddress(user1.address);
            const lsrMinBalance = 10; // divide by 10000
            await contractRouter_mod
                .connect(user1)
                .setLsrMinBalance(lsrMinBalance);
            expect(
                await contractRouter_mod.connect(user1).getLsrMinBalance()
            ).to.equal(lsrMinBalance);
        });

        it("Try set fee without admin roles", async () => {
            const { owner, user1, user2, contractRouter_mod } =
                await loadFixture(deployRouterFixture);
            //await contractRouter_mod.setAdminAddress(user1.address);
            const swapFee = 10; // divide by 10000
            let errMessage: string = "";
            try {
                await contractRouter_mod.connect(owner).setSwapFee(swapFee);
            } catch (error) {
                errMessage = (error as Error).message;
                console.log(errMessage);
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
            await contractApple
                .connect(user3)
                .getTokens(appleLiqAmount.toString());
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
            await contractRouter_mod
                .connect(owner)
                .setAdminAddress(user1.address);
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
                    ((appleSwapAmount.toString() as unknown as number) *
                        swapFee) /
                        10000
                )
            );
        });
    });
});
