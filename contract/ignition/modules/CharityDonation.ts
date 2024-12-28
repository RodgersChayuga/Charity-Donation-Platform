async function main() {
    const { ethers } = require("hardhat");
    const MyContract = await ethers.getContractFactory("MyContract");
    const myContract = await MyContract.deploy("Hello, Sepolia!");
    await myContract.deployed();
    console.log("MyContract deployed to:", myContract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });