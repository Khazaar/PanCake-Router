import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;

    const { deployer } = await getNamedAccounts();

    await deploy("PancakeFactory", {
        from: deployer,
        args: [ethers.constants.AddressZero],
        log: true,
    });
};
export default func;
func.tags = ["PancakeFactory"];
