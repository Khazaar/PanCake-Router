import { ethers } from "hardhat";
import { PancakeERC20__factory, PancakeFactory__factory, PancakePair__factory, PancakePair, ERC20Apple__factory, ERC20Potato__factory, ERC20LSR__factory } from "../typechain-types"
import { ContractAddress } from "./local-chain-data"

async function main() {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();
    const users = [owner, user1, user2, user3, user4];
    const contractApple = await new ERC20Apple__factory(owner).attach(ContractAddress.ERC20Apple);
    const contractPotato = await new ERC20Potato__factory(owner).attach(ContractAddress.ERC20Potato);
    const contractLSR = await new ERC20LSR__factory(owner).attach(ContractAddress.ERC20LSR);
    const pancakeERC20 = await new PancakeERC20__factory(owner).attach(ContractAddress.PancakePair);
    const pancakeFactory = await new PancakeFactory__factory(owner).attach(ContractAddress.PancakeFactory);

    // const pairAddress = await pancakeFactory.getPair(contractApple.address, contractPotato.address);
    // const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress)
    // const [reserve0, reserve1, time] = await pair.getReserves();

    let i = 1;
    console.log(`Balances:`);
    console.log(`User\tAPL\tPPT\tLSR`);

    for (const usr of users) {
        console.log(`${i} \t${await contractApple.balanceOf(usr.address)}\t${await contractPotato.balanceOf(usr.address)}\t${await contractLSR.balanceOf(usr.address)}`);
        i++;
    }

    console.log(`Pairs:`);
    const nPairs = await pancakeFactory.allPairsLength();

    console.log(`Factory contains ${nPairs.toString()} pair(s)`);


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
