import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    tests: "./test",    // Points to main test directory
    artifacts: "./artifacts",
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [`0x${process.env.WALLET_PRIVATE_KEY}`]
    }
  }
};

export default config;
