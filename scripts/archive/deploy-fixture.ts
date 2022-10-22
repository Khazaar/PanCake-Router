import { ethers } from "hardhat";
import { PancakeRouter_mod__factory, ERC20LSR__factory, PancakeFactory__factory, PancakePair__factory, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory, ERC20RottenCarrot__factory } from "../typechain-types"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Contract, ContractType } from "hardhat/internal/hardhat-network/stack-traces/model";

export async function deployPankaceFixture() {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const address0 = ethers.constants.AddressZero; //ethers.utils.getAddress("0x0000000000000000000000000000000000000000");

    // Deploy Apple contract
    const contractApple = await new ERC20Apple__factory(owner).deploy();
    await contractApple.deployed();
    //console.log(`Apple contract deployed to ${await contractApple.address}`);
    // Deploy Potato contract
    const contractPotato = await new ERC20Potato__factory(owner).deploy();
    console.log(`Potato contract deployed to ${await contractPotato.address}`);
    // Deploy factory
    const pancakeFactory = await new PancakeFactory__factory(owner).deploy(address0);
    console.log(`Factory deployed successfully to ${pancakeFactory.address}`);
    // Deploy router
    const router = await new PancakeRouter__factory(owner).deploy(pancakeFactory.address, address0);
    console.log(`Router deployed at ${router.address}`);
    // Deploy scam token Rotten Carrot
    const contractRottenCarrot = await new ERC20RottenCarrot__factory(owner).deploy();
    console.log(`Rotten Carrot contract deployed to ${await contractRottenCarrot.address}`);
    // Deploy PancakeERC20 liquidity token
    const contractPancakeERC20 = await new PancakePair__factory(owner).deploy();
    console.log(`PancakeERC20 liquidity token contract deployed to ${await contractPancakeERC20.address}`);
    // Deploy LSRERC20 token
    const contractLSRERC20 = await new ERC20LSR__factory(owner).deploy();
    console.log(`LSRERC20 token contract deployed to ${await contractLSRERC20.address}`);
    // Deploy router_mod
    const router_mod = await new PancakeRouter_mod__factory(owner).deploy(pancakeFactory.address, address0);
    console.log(`Router_mod deployed at ${router_mod.address}`);

    const appleAmount = BigInt(1000000);
    const lsrAmount = BigInt(1000000);
    const potatoAmount = BigInt(2000000);

    // | User  | Role  | ALP | PTT | LSR |
    // | ----- | ----- | --- | --- | --- |
    // | user1 | admin | 10  | 0   | 0   |
    // | user2 | -     | 0   | 20  | 0   |
    // | user3 | -     | 10  | 20  | 0   |
    // | user4 | -     | 10  | 20  | 10  |

    // Fund with Apple
    await contractApple.connect(user1).getTokens(appleAmount.toString());
    await contractApple.connect(user3).getTokens(appleAmount.toString());
    await contractApple.connect(user4).getTokens(appleAmount.toString());

    //Fund with Potato
    await contractPotato.connect(user2).getTokens(potatoAmount.toString());
    await contractPotato.connect(user3).getTokens(appleAmount.toString());
    await contractPotato.connect(user4).getTokens(potatoAmount.toString());

    //Fund with LSR
    await contractLSRERC20.connect(user4).getTokens(lsrAmount.toString());

    // Fund and approve user3 - liquidity provider

    await contractApple.connect(user3).getTokens(appleAmount.toString());
    await contractPotato.connect(user3).getTokens(potatoAmount.toString());
    await contractApple.connect(user3).approve(router_mod.address, appleAmount.toString());
    await contractPotato.connect(user3).approve(router_mod.address, potatoAmount.toString());



    // Create Potato-Apple pair
    let tx1 = await pancakeFactory.createPair(contractPotato.address, contractApple.address);
    //console.log(`Pair created successfully to ${pancakeFactory.address}`);

    let tx2 = await pancakeFactory.createPair(contractPotato.address, contractLSRERC20.address);
    //console.log(`Pair created successfully to ${pancakeFactory.address}`);
    let tx3 = await pancakeFactory.createPair(contractLSRERC20.address, contractApple.address);

    return {
        owner, user1, user2, user3, user4, contractApple, contractPotato, pancakeFactory, router, contractPancakeERC20,
        contractLSRERC20, router_mod, appleAmount, lsrAmount, potatoAmount
    };

}

async function dexStatus(_pContracts: Contract[]) {



    let i = 0;
    console.log(`Balances:`);
    console.log(`User\tAPL\tPPT\tLSR\tPancakeERC20`);

    for (const usr of users) {
        console.log(`${i} \t${await contractApple.balanceOf(usr.address)}\t${await contractPotato.balanceOf(usr.address)}\t${await contractLSRERC20.balanceOf(usr.address)}\t${await contractPancakeERC20.balanceOf(usr.address)}`);
        i++;
    }

    console.log(`Pairs:`);
    const nPairs = await pancakeFactory.allPairsLength();

    console.log(`Factory contains ${nPairs.toString()} pair(s)`);


}

async function main() {
    const { owner, user1, user2, user3, user4, contractApple, contractPotato, pancakeFactory, router, contractPancakeERC20,
        contractLSRERC20, router_mod, appleAmount, lsrAmount, potatoAmount } = await loadFixture(deployPankaceFixture);

    const pContracts = [contractApple, contractPotato, pancakeFactory, router, contractPancakeERC20,
        contractLSRERC20];





    //Add liquidity
    const tx = await router_mod.connect(user3).addLiquidity(
        contractApple.address, contractPotato.address,
        appleAmount, potatoAmount,
        appleAmount, potatoAmount,
        user3.address, 216604939048);

    // const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
    // const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);
};




// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
