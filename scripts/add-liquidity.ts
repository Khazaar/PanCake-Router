import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { ethers } from "hardhat";
import { ERC20LSR__factory, PancakeERC20__factory, PancakeFactory, PancakeFactory__factory, PancakePair__factory, PancakePair, PancakeRouter, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter_mod__factory } from "../typechain-types"
import { ContractAddress } from "./local-chain-data"
import { deployPankaceFixture } from "./deploy-fixture";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

async function main() {
    const { owner, user1, user2, user3, user4, contractApple, contractPotato, pancakeFactory, router, contractPancakeERC20,
        contractLSRERC20, router_mod, appleAmount, lsrAmount, potatoAmount } = await loadFixture(deployPankaceFixture);


    //Add liquidity
    const tx = await router_mod.connect(user3).addLiquidity(
        contractApple.address, contractPotato.address,
        appleAmount, potatoAmount,
        appleAmount, potatoAmount,
        user3.address, 216604939048);

    const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
    const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


// function addLiquidity(
//     address tokenA,
//     address tokenB,
//     uint amountADesired,
//     uint amountBDesired,
//     uint amountAMin,
//     uint amountBMin,
//     address to,
//     uint deadline
//   ) 