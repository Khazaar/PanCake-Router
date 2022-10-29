import { ethers } from "hardhat";
import { address } from "hardhat/internal/core/config/config-validation";
import { ExampleOracleSimple__factory, PancakeRouter_mod__factory, ERC20LSR__factory, PancakeFactory__factory, PancakePair__factory, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory, ERC20RottenCarrot__factory } from "../typechain-types"
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
// import 'hardhat-deploy';
//import 'hardhat-deploy-ethers';

import '@nomiclabs/hardhat-ethers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();
    const pancakeFactory = await ethers.getContract("PancakeFactory");
    const contractApple = await ethers.getContract("ERC20Apple");
    const contractPotato = await ethers.getContract("ERC20Potato");

    await deploy('ExampleOracleSimple', {
        from: deployer,
        args: [pancakeFactory.address, contractApple.address, contractPotato.address],
        log: true,
    });
};
export default func;
func.tags = ['ExampleOracleSimple'];

