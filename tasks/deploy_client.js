const {
    task
} = require('hardhat/config');
const Config = require('../config');
const {
    deployContract,
} = require('./helpers');

task("deploy:client", "Deploy ChainlinkClient")
 .addFlag('verify', 'Verify contracts at Etherscan')
 .setAction(async ({ verify }, hre) => {
    await hre.run('set-DRE');
    const linkToken = Config[hre.network.name].link;

    await deployContract(
        'VinciChainlinkClient',
        [
            linkToken,
        ],
        verify,
    );
});
