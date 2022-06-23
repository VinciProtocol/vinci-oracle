const {
    task
} = require('hardhat/config');
const Config = require('../config');
const {
    saveContract,
    getNFTConfig,
} = require('./helpers');


task("save:client", "Save ChainlinkClient")
 .addParam('address', 'address')
 .setAction(async ({ address }, hre) => {
    await hre.run('set-DRE');

    await saveContract('VinciChainlinkClient', address);
});


task("save:aggregator", "Save VinciCollectAggregator")
 .addParam('address', 'address')
 .addParam('nft', 'Aggregator for this NFT')
 .setAction(async ({ address }, hre) => {
    await hre.run('set-DRE');
    const nftConfig = getNFTConfig(nft);

    await saveContract('VinciCollectAggregator', address);
});


task("save:collector", "Save VinciCollectPriceCumulative")
 .addParam('address', 'address')
 .addParam('nft', 'Collector for this NFT')
 .setAction(async ({ address }, hre) => {
    await hre.run('set-DRE');
    const nftConfig = getNFTConfig(nft);

    await saveContract('VinciCollectPriceCumulative', address);
});
