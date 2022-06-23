const {
    task
} = require('hardhat/config');
const Config = require('../config');
const {
    saveContract,
    getContract,
    getNFTConfig,
} = require('./helpers');


task("save:client", "Save ChainlinkClient")
 .addParam('address', 'address')
 .setAction(async ({ address }, hre) => {
    await hre.run('set-DRE');

    const contract = await getContract('VinciChainlinkClient', null, address);
    await saveContract('VinciChainlinkClient', contract);
});


task("save:aggregator", "Save VinciCollectAggregator")
 .addParam('address', 'address')
 .addParam('nft', 'Aggregator for this NFT')
 .setAction(async ({ address, nft }, hre) => {
    await hre.run('set-DRE');
    const nftConfig = getNFTConfig(nft);

    const contract = await getContract('VinciCollectAggregator', nft, address);
    await saveContract('VinciCollectAggregator', contract, nft);
});


task("save:collector", "Save VinciCollectPriceCumulative")
 .addParam('address', 'address')
 .addParam('nft', 'Collector for this NFT')
 .setAction(async ({ address, nft }, hre) => {
    await hre.run('set-DRE');
    const nftConfig = getNFTConfig(nft);

    const contract = await getContract('VinciCollectPriceCumulative', nft, address);
    await saveContract('VinciCollectPriceCumulative', contract, nft);
});
