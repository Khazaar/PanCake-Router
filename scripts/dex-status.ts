import { PancakeRouter_mod, ERC20Pancake__factory, PancakeFactory__factory, PancakePair__factory, PancakePair, ERC20Apple__factory, ERC20Potato__factory, ERC20LSR__factory } from "../typechain-types"
import { ethers, deployments, getNamedAccounts } from 'hardhat';
import 'hardhat-deploy';
import 'hardhat-deploy-ethers';

async function main() {

    const [owner, user1, user2, user3, user4, user5] = await ethers.getSigners();
    const users = [owner, user1, user2, user3, user4, user5];

    const contractApple = await ethers.getContract("ERC20Apple");
    const contractPotato = await ethers.getContract("ERC20Potato");
    const contractLSR = await ethers.getContract("ERC20LSR");
    const contractPancake = await ethers.getContract("ERC20Pancake");
    const pancakeFactory = await ethers.getContract("PancakeFactory");
    const router_mod: PancakeRouter_mod = await ethers.getContract("PancakeRouter_mod");

    let i = 0;
    console.log(`Balances:`);
    console.log(`User\tAPL\tPPT\tLSR\tETH`);

    for (const usr of users) {
        let bl = ethers.utils.formatEther(await usr.getBalance());
        console.log(`${i} \t${await contractApple.balanceOf(usr.address)}\t${await contractPotato.balanceOf(usr.address)}\t${await contractLSR.balanceOf(usr.address)}\t${bl}`);
        i++;
    }

    console.log(`router \t${await contractApple.balanceOf(router_mod.address)}\t${await contractPotato.balanceOf(router_mod.address)}\t${await contractLSR.balanceOf(router_mod.address)}`);

    console.log(`Pairs:`);

    const nPairs = await pancakeFactory.allPairsLength();
    console.log(`Factory contains ${nPairs.toString()} pair(s)`);
    let pairs: PancakePair[] = [];
    for (let i = 0; i < nPairs; i++) {
        try {
            const pairAddress = await pancakeFactory.allPairs(i);//.getPair(contractApple.address, contractPotato.address);
            const pair: PancakePair = await new PancakePair__factory(owner).attach(pairAddress);
            pairs.push(pair);
        }
        catch (error) {
            console.error(error);
        }
    }

    for (const pair of pairs) {
        console.log(``);
        console.log(`Pair address ${await pair.address}`);
        console.log(`Tokens: ${await pair.token0()} and ${await pair.token1()}`);
        const [reserve0, reserve1, time] = await pair.getReserves();
        console.log(`Reserves are: ${reserve0.toString()}, ${reserve1.toString()}`);
    };
}
// Naki
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
