import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { tenderly } from "hardhat";
import { PancakeERC20__factory, PancakeFactory, PancakeFactory__factory, PancakePair__factory, PancakePair, PancakeRouter, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory } from "../typechain-types"

async function main() {
    const appleContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const potatoContractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const pancakeERC20ContractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
    const factoryContractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
    const routerContractAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

    const [owner, user1, user2, user3] = await ethers.getSigners();
    const users = [owner, user1, user2, user3]
    const address0 = ethers.constants.AddressZero;
    const contractApple = await new ERC20Apple__factory(owner).attach(appleContractAddress);
    const contractPotato = await new ERC20Potato__factory(owner).attach(potatoContractAddress);
    const pancakeERC20 = await new PancakeERC20__factory(owner).attach(pancakeERC20ContractAddress);
    const pancakeFactory = await new PancakeFactory__factory(owner).attach(factoryContractAddress);
    const router = await new PancakeRouter__factory(owner).attach(routerContractAddress);


    const hash1 = await pancakeFactory.INIT_CODE_PAIR_HASH();

    const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
    const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);

    const [reserve0, reserve1, time] = await pair.getReserves();
    console.log(`Reserves are: ${reserve0.toString()}, ${reserve1.toString()}`);
    console.log(`Cumulative prices is: ${await pair.price0CumulativeLast()}`);

    const appleAmount = BigInt(1000000);
    const potatoAmount = BigInt(2000000);
    await contractApple.connect(user3).getTokens(appleAmount.toString());
    await contractPotato.connect(user3).getTokens(potatoAmount.toString());
    await contractApple.connect(user3).approve(router.address, appleAmount.toString());
    await contractPotato.connect(user3).approve(router.address, potatoAmount.toString());

    await router.connect(user3).swapExactTokensForTokens(1000, 100, [appleContractAddress, potatoContractAddress], user3.address, 99999999999999);

}





// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});