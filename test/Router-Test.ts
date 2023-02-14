import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { run } from "hardhat";
import { tenderly } from "hardhat";

import {
    PancakeFactory,
    PancakeFactory__factory,
    PancakePair__factory,
    PancakePair,
    PancakeRouter,
    ERC20Apple__factory,
    ERC20Potato__factory,
    PancakeRouter__factory,
} from "../typechain-types";

describe("Router test", function () {
    async function deployRouterFixture() {
        await run("deploy");
        const [owner, user1, user2, user3, user4] = await ethers.getSigners();
        const users = [owner, user1, user2, user3, user4];
        const contractApple = await ethers.getContract("ERC20Apple");
        const contractPotato = await ethers.getContract("ERC20Potato");
        const contractLSR = await ethers.getContract("ERC20LSR");
        const contractPancake = await ethers.getContract("ERC20Pancake");
        const pancakeFactory: PancakeFactory = await ethers.getContract(
            "PancakeFactory"
        );
        console.log(
            `Factory deployed successfully to ${pancakeFactory.address}`
        );

        //Deploy router
        const router = await new PancakeRouter__factory(owner).deploy(
            pancakeFactory.address,
            ethers.constants.AddressZero
        );
        console.log("Apple address, ", contractApple.address);
        run("print", { message: "Hello, World!" });

        return {
            owner,
            user1,
            user2,
            user3,
            contractApple,
            contractPotato,
            contractPancake,
            router,
            pancakeFactory,
        };
    }

    describe("ERC20 features", function () {
        it("Fund user 1 with apple", async () => {
            const { user1, contractApple } = await loadFixture(
                deployRouterFixture
            );
            const appleAmount = BigInt(10);
            console.log("Apple address, ", contractApple.address);
            await contractApple
                .connect(user1)
                .getTokens(appleAmount.toString());
            expect(await contractApple.balanceOf(user1.address)).to.equal(
                appleAmount
            );
        });

        it("Fund user 2 with potato", async () => {
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

        it("Fund user 3 with apple and potato", async () => {
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
            console.log(tx.hash);
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
                router,
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
                .approve(router.address, appleAmount.toString());
            await contractPotato
                .connect(user3)
                .approve(router.address, potatoAmount.toString());

            // Add liquidity
            const tx = await router
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
    });

    it("Swap APL to PTT", async () => {
        const {
            user1,
            user3,
            contractApple,
            contractPotato,
            router,
            pancakeFactory,
        } = await loadFixture(deployRouterFixture);
        const appleLiqAmount = BigInt(100000);
        const potatoLiqAmount = BigInt(100000);
        // Approve
        await contractApple.connect(user3).getTokens(appleLiqAmount.toString());
        await contractPotato
            .connect(user3)
            .getTokens(potatoLiqAmount.toString());
        await contractApple
            .connect(user3)
            .approve(router.address, appleLiqAmount.toString());
        await contractPotato
            .connect(user3)
            .approve(router.address, appleLiqAmount.toString());
        // Add liquidity
        const tx = await router
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
        const appleSwapAmount = BigInt(100000);

        expect(1).to.equal(1);
    });

    describe("Admin features", () => {
        it("Set admin", async () => {
            expect(1).to.equal(1);
        });

        it("Set fee", async () => {
            expect(1).to.equal(1);
        });
    });
});
