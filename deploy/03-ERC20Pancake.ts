import { ethers } from "hardhat";
import { address } from "hardhat/internal/core/config/config-validation";
import { PancakeRouter_mod__factory, ERC20LSR__factory, PancakeFactory__factory, PancakePair__factory, ERC20Apple__factory, ERC20Potato__factory, PancakeRouter__factory, ERC20RottenCarrot__factory } from "../typechain-types"
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    await deploy('ERC20Pancake', {
        from: deployer,
        args: [],
        log: true,
    });
};
export default func;
func.tags = ['ERC20Pancake'];