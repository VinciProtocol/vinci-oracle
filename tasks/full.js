const {
    task
} = require('hardhat/config');
const Config = require('../config');
const {
    deployContract,
} = require('./helpers');

task("full:deploy", "Deploy all")
 .addParam('nft', 'NFT name')
 .addFlag('verify', 'Verify contracts at Etherscan')
 .setAction(async ({ nft, verify }, hre) => {
    await hre.run('set-DRE');
    
    await hre.run('deploy:client', { verify });

    await hre.run('deploy:collector', { verify, nft: nft });
    await hre.run('deploy:collector:set-node', { nft: nft });
    await hre.run('deploy:collector:transfer-right', { nft: nft });

    await hre.run('deploy:aggregator', { verify, nft: nft });
    await hre.run('deploy:aggregator:set-collector', { nft: nft });
});
