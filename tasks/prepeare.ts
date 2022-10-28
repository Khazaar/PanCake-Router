// tasks/deploy.ts
import { task } from "hardhat/config";

task("prepeare", "Deploy, fund, add liq").setAction(
    async (_args, { ethers, run }) => {
        await run("run", { script: "scripts/fund-users.ts" });
    }
);
