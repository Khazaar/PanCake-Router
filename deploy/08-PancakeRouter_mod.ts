import { ethers } from "hardhat";
import { address } from "hardhat/internal/core/config/config-validation";
import { PancakeRouter_mod__factory, ERC20LSR__factory, PancakeFactory__factory, PancakePair__factory, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory, ERC20RottenCarrot__factory } from "../typechain-types"
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
// import 'hardhat-deploy';
//import 'hardhat-deploy-ethers';

import '@nomiclabs/hardhat-ethers';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();
    const contractPancakeFactory = await ethers.getContract("PancakeFactory");
    const contractLSR = await ethers.getContract("ERC20LSR");

    await deploy('PancakeRouter_mod', {
        from: deployer,
        args: [contractPancakeFactory.address, ethers.constants.AddressZero, contractLSR.address],
        log: true,
    });
};
export default func;
func.tags = ['PancakeRouter_mod'];

