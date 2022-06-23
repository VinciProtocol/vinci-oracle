const {
    task
} = require('hardhat/config');

const Config = require('../config');
const {
    deployContract,
    getContract,
    getTxConfig,
    getNFTConfig,
    waitTx,
} = require('./helpers');


task("deploy:aggregator", "Deploy CollectAggregator")
 .addParam('nft', 'Aggregator for this NFT')
 .addFlag('verify', 'Verify contracts at Etherscan')
 .setAction(async ({ verify, nft }, hre) => {
    await hre.run('set-DRE');

    const nftConfig = getNFTConfig(nft);
    let contract = await getContract('VinciCollectAggregator', nft);
    if (!contract) {
        await deployContract(
            'VinciCollectAggregator',
            [
                0,                                          // timeout
                0,                                          // minSubmissionValue
                BigInt('99999999999999999999999999999999'), // maxSubmissionValue
                18,                                         // decimals
                nftConfig.timeinterval,                   // timeInterval
                nftConfig.description,                    // description
            ],
            verify,
            nft,
        );
    };
});


task("deploy:aggregator:set-collector", "CollectAggregator.setCollector")
 .addParam('nft', 'Aggregator for this NFT')
 .setAction(async ({ verify, nft }, hre) => {
    await hre.run('set-DRE');

    const nftConfig = getNFTConfig(nft);
    const collector = await getContract('VinciCollectPriceCumulative', nft);
    let aggregator = await getContract('VinciCollectAggregator', nft);

    console.log(`🔨 Set VinciCollectAggregator collector: ${collector.address}.`);
    const txConfig = getTxConfig();
    await waitTx(
        await aggregator.setCollector(collector.address, txConfig)
    );
});
