import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";

import { deployRouterFixture } from "./deployFixture";
describe("ERC20 features", function () {
    it("Fund user1 with apple", async () => {
        const { user1, contractApple } = await loadFixture(deployRouterFixture);
        const appleAmount = BigInt(10);
        await contractApple.connect(user1).getTokens(appleAmount.toString());
        expect(await contractApple.balanceOf(user1.address)).to.equal(
            appleAmount
        );
    });
    it("Fund user2 with potato", async () => {
        const { user2, contractPotato } = await loadFixture(
            deployRouterFixture
        );
        const potatoAmount = BigInt(20);
        await contractPotato.connect(user2).getTokens(potatoAmount.toString());
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
        await contractPotato.connect(user3).getTokens(potatoAmount.toString());
        await contractApple.connect(user3).getTokens(appleAmount.toString());
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
        await contractApple.connect(user1).getTokens(appleAmount.toString());

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
