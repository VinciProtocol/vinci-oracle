const {
    task
} = require('hardhat/config');
const Config = require('../config');
const {
    deployContract,
    getContract,
    verifyContract,
} = require('./helpers');

task("deploy:client", "Deploy ChainlinkClient")
 .addFlag('verify', 'Verify contracts at Etherscan')
 .setAction(async ({ verify }, hre) => {
    await hre.run('set-DRE');
    const linkToken = Config[hre.network.name].link;
    const args = [
        linkToken,
    ];

    const contract = await getContract('VinciChainlinkClient');
    if (!contract) {
        await deployContract('VinciChainlinkClient', args, verify);
    } else if (verify) {
        await verifyContract('VinciChainlinkClient', contract.address, ...args);
    };
});
