require('dotenv').config();
const hre = require("hardhat");


async function verifyContract(name, contractAddress, ...args) {
    console.log(`⭐️  Verify ${name} at`, contractAddress);
    try {
        // npx hardhat verify --network network
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        console.log("❌ Verified Error, Please check on scan.");
    };
}


async function getContract(name, address) {
    if (!address) {
        return null;
    }
    console.log(`Get ${name} Contract at ${address}`);
    return await hre.ethers.getContractAt(name, address);
}


async function deployContract(name, ...args) {
    console.log(`Deploying ${name} contract...`);
    const Contract = await hre.ethers.getContractFactory(name);
    const contract = await Contract.deploy(...args);
    await contract.deployed();

    console.log(`✅  Deployed ${name} at`, contract.address);

    if (process.env.VERIFY == "true") {
        await verifyContract(name, contract.address, ...args);
    };
    return contract;
}


exports.Context = async (callback) => {
    const context = {
        getContract: getContract,
        deployContract: deployContract,
        verifyContract: verifyContract,
    };
    try {
        await callback(context, hre.network.name);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    };
}
