const {
    task
} = require('hardhat/config');

const Config = require('../config');
const {
    deployContract,
    getContractByNFT,
} = require('./helpers');

task("deploy:aggregator", "Deploy CollectAggregator")
 .addParam('nft', 'Aggregator for this NFT')
 .addFlag('verify', 'Verify contracts at Etherscan')
 .setAction(async ({ verify, nft }, hre) => {
    await hre.run('set-DRE');

    let nftConfig;
    try {
        nftConfig = Config[hre.network.name].nodes[nft]
    } catch (error) {
        console.error(`NFT: ${nft} must be provided in config[${hre.network.name}].nodes`);
        process.exit(1);
    };

    const collector = await getContractByNFT('VinciCollectPriceCumulative', nft);
    if (!collector) {
        console.error('Please run `npx hardhat deploy:collector` first.');
        process.exit(1);
    };

    const contractName = 'VinciCollectAggregator';
    let contract = await getContractByNFT(contractName, nft);
    if (!contract) {
        contract = await deployContract(
            contractName,
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

    console.log("🔨 setCollector ...");
    await contract.setCollector(collector.address);
    console.log(`✔️  Set VinciCollectAggregator collector: ${collector.address}.`);
});
