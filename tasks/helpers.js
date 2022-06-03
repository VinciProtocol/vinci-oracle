const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

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


exports.getAddress = async (name) => {
    return await getDB().get(
        `${name}.${DRE.network.name}.address`,
    ).value();
};


exports.saveContract = async (name, contract, nftName = undefined) => {
    let key;
    if (nftName) {
        key = `${name}.${nftName}.${DRE.network.name}`;
    } else {
        key = `${name}.${DRE.network.name}`;
    }
    await getDB().set(
        key,
        {
            address: contract.address,
            deployer: contract.deployTransaction.from,
        },
    ).write();
};


exports.getSigner = async (index = 0 ) => {
    const accounts = await DRE.ethers.getSigners();
    return accounts[index];
};


exports.getContract = async (name, addr = undefined) => {
    const address = addr || (await this.getAddress(name));

    if (!address) {
        return null;
    }
    console.log(`Get ${name} Contract at ${address}`);
    return await DRE.ethers.getContractAt(name, address);
};


exports.getContractByNFT = async (name, nftName) => {
    const addr = await this.getAddress(`${name}.${nftName}`);
    return await this.getContract(name, addr);
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


exports.deployContract = async (name, args, verify = false, nftName = undefined) => {
    console.log(`Deploying ${name} contract...`);
    const Contract = await DRE.ethers.getContractFactory(name);
    const contract = await Contract.deploy(...args);
    await contract.deployed();

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
