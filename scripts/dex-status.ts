import { ERC20Pancake__factory, PancakeFactory__factory, PancakePair__factory, PancakePair, ERC20Apple__factory, ERC20Potato__factory, ERC20LSR__factory } from "../typechain-types"
import { ContractAddress } from "./local-chain-data"
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers, deployments, getNamedAccounts } from 'hardhat';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

async function main() {

    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const users = [owner, user1, user2, user3, user4];
    //await deployments.fixture();
    // const contractApple = await new ERC20Apple__factory(owner).attach(ContractAddress.ERC20Apple);
    // const contractPotato = await new ERC20Potato__factory(owner).attach(ContractAddress.ERC20Potato);
    // const contractLSRERC20 = await new ERC20LSR__factory(owner).attach(ContractAddress.ERC20LSR);
    // const pancakeERC20 = await new PancakeERC20__factory(owner).attach(ContractAddress.PancakePair);
    // const pancakeFactory = await new PancakeFactory__factory(owner).attach(ContractAddress.PancakeFactory);
    const contractApple = await ethers.getContract("ERC20Apple");
    const contractPotato = await ethers.getContract("ERC20Potato");
    const contractLSR = await ethers.getContract("ERC20LSR");
    const contractPancake = await ethers.getContract("ERC20Pancake");
    const pancakeFactory = await ethers.getContract("PancakeFactory");


    let i = 0;
    console.log(`Balances:`);
    console.log(`User\tAPL\tPPT\tLSR\tETH`);

    for (const usr of users) {
        let bl = ethers.utils.formatEther(await usr.getBalance());
        console.log(`${i} \t${await contractApple.balanceOf(usr.address)}\t${await contractPotato.balanceOf(usr.address)}\t${await contractLSR.balanceOf(usr.address)}\t${bl}`);
        i++;
    }

    console.log(`Pairs:`);
    try {
        const nPairs = await pancakeFactory.allPairsLength();
        console.log(`Factory contains ${nPairs.toString()} pair(s)`);
        const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
        const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);
    }
    catch (error) {
        console.error(error);

    }

    //let liqAmount = (await pair.balanceOf(user3.address)).toBigInt();//: BigInt = (await pair.balanceOf(user3.address)).toBigInt();

    //console.log(`Liq tokens: ${liqAmount}`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
