const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Config = require('../config');

let DRE;

exports.setDRE = (_DRE) => {
    DRE = _DRE;
};


function sleep(second) {
    return new Promise((resolve) => setTimeout(resolve, 1000 * second));
};


function getDB() {
    return low(new FileSync('deployed-contracts.json'));
};


function getKey(name, nftName = undefined) {
    let key;
    if (nftName) {
        key = `${name}.${nftName}.${DRE.network.name}`;
    } else {
        key = `${name}.${DRE.network.name}`;
    };
    return key;
}


exports.getAddress = async (name, nftName = undefined) => {
    const key = getKey(name, nftName);
    return await getDB().get(
        `${key}.address`,
    ).value();
};


exports.saveContract = async (name, contract, nftName = undefined) => {
    const key = getKey(name, nftName);
    await getDB().set(
        key,
        {
            address: contract.address,
        },
    ).write();
};


exports.getNFTConfig = (nftName) => {
    try {
        return Config[DRE.network.name].nodes[nftName];
    } catch (error) {
        console.error(`NFT: ${nftName} must be provided in config[${DRE.network.name}].nodes`);
        process.exit(1);
    };
};


exports.waitTx = async (tx) => {
    console.log('🍵 TransactionHash:', tx.hash);
    const res = await tx.wait(1);
    console.log('✅ gasUsed', res.gasUsed.toString());
    return res;
};


exports.getSigner = async (index = 0 ) => {
    const accounts = await DRE.ethers.getSigners();
    return accounts[index];
};


exports.getContract = async (name, nftName = undefined, addr = undefined) => {
    const address = addr || (await this.getAddress(name, nftName));

    if (!address) {
        return null;
    }
    console.log(`Get ${name} Contract at ${address}`);
    return await DRE.ethers.getContractAt(name, address);
};


exports.verifyContract = async (name, contractAddress, ...args) => {
    console.log(`⭐️  Verify ${name} at`, contractAddress);
    try {
        // npx hardhat verify --network network
        await DRE.run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (error) {
        console.log("❌ Verified Error, Please check on scan.", error);
    };
};


exports.getTxConfig = () => {
    let txConfig = {}
    if (process.env.maxPriorityFeePerGas && process.env.maxFeePerGas && process.env.gasLimit) {
        txConfig = {
            maxPriorityFeePerGas: process.env.maxPriorityFeePerGas,
            maxFeePerGas: process.env.maxFeePerGas,
            gasLimit: process.env.gasLimit,
        }
        console.log('👉 Get Config:', txConfig);
    };
    return txConfig;
};


exports.deployContract = async (name, args, verify = false, nftName = undefined) => {
    console.log(`Deploying ${name} contract...`);
    const Contract = await DRE.ethers.getContractFactory(name);
    const txConfig = this.getTxConfig();
    const contract = await Contract.deploy(...args, txConfig);
    await contract.deployed()

    console.log(`✅  Deployed ${name} at`, contract.address);

    await this.saveContract(name, contract, nftName);

    if (verify) {
        const second = 30;
        console.log(`🍵 Wait ${second} seconds for verify...`);
        await sleep(second);
        await this.verifyContract(name, contract.address, ...args);
    };
    return contract;
}
