import { ethers } from "hardhat";
import { address } from "hardhat/internal/core/config/config-validation";
import { PancakeRouter_mod__factory, ERC20LSR__factory, PancakeFactory__factory, PancakePair__factory, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory, ERC20RottenCarrot__factory } from "../typechain-types"
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";


const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    await deploy('ERC20Apple', {
        from: deployer,
        args: [],
        log: true,
    });
};
export default func;
func.tags = ['ERC20Apple'];


// async function main() {
//     const [owner, user1, user2, user3] = await ethers.getSigners();
//     const address0 = ethers.constants.AddressZero; //ethers.utils.getAddress("0x0000000000000000000000000000000000000000");

//     // Deploy Apple contract
//     const contractApple = await new ERC20Apple__factory(owner).deploy();
//     console.log(`Apple contract deployed to ${await contractApple.address}`);

//     // Deploy Potato contract
//     const contractPotato = await new ERC20Potato__factory(owner).deploy();
//     console.log(`Potato contract deployed to ${await contractPotato.address}`);

//     // Deploy factory
//     const pancakeFactory = await new PancakeFactory__factory(owner).deploy(address0);
//     console.log(`Factory deployed successfully to ${pancakeFactory.address}}`);

//     // Deploy router
//     const router = await new PancakeRouter__factory(owner).deploy(pancakeFactory.address, address0);
//     console.log(`Router deployed at ${router.address}`);

//     // Deploy scam token Rotten Carrot
//     const contractRottenCarrot = await new ERC20RottenCarrot__factory(owner).deploy();
//     console.log(`Rotten Carrot contract deployed to ${await contractRottenCarrot.address}`);

//     // Deploy PancakeERC20 liquidity token
//     const contractPancakeERC20 = await new PancakePair__factory(owner).deploy();
//     console.log(`PancakeERC20 liquidity token contract deployed to ${await contractPancakeERC20.address}`);

//     // Deploy LSRERC20 token
//     const contractLSRERC20 = await new ERC20LSR__factory(owner).deploy();
//     console.log(`LSRERC20 token contract deployed to ${await contractLSRERC20.address}`);

//     // Deploy router_mod
//     const router_mod = await new PancakeRouter_mod__factory(owner).deploy(pancakeFactory.address, address0);
//     console.log(`Router_mod deployed at ${router_mod.address}`);


// }

