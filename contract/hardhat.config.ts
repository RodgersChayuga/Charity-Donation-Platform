import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    tests: "./test",    // Points to main test directory
    artifacts: "./artifacts",
  },
};

export default config;
