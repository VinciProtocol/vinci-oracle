const {
    task
} = require('hardhat/config');
const Web3Utils = require('web3-utils');

const Config = require('../config');
const {
    deployContract,
    getContract,
    getNFTConfig,
    waitTx,
    getTxConfig,
    verifyContract,
} = require('./helpers');

task("deploy:collector", "Deploy CollectPriceCumulative")
 .addParam('nft', 'Price for this NFT')
 .addFlag('verify', 'Verify contracts at Etherscan')
 .setAction(async ({ verify, nft }, hre) => {
    await hre.run('set-DRE');

    const nftConfig = getNFTConfig(nft);

    const args = [
        0,                                          // timeout
        0,                                          // minSubmissionValue
        BigInt('99999999999999999999999999999999'), // maxSubmissionValue
        18,                                         // decimals
        nftConfig.description,                      // description
    ];

    const contract = await getContract('VinciCollectPriceCumulative', nft);
    if (!contract) {
        await deployContract(
            'VinciCollectPriceCumulative',
            args,
            verify,
            nft,
        );
    } else if (verify) {
        await verifyContract('VinciCollectPriceCumulative', contract.address, ...args)
    };
});


task("deploy:collector:set-node", "set not CollectPriceCumulative")
 .addParam('nft', 'Price for this NFT')
 .setAction(async ({ verify, nft }, hre) => {
    await hre.run('set-DRE');

    const nftConfig = getNFTConfig(nft);

    const client = await getContract('VinciChainlinkClient');
    const collector = await getContract('VinciCollectPriceCumulative', nft);

    console.log(
        "🔨 VinciChainlinkClient setNode:",
        "\n  vinciCollectPriceCumulative:", collector.address,
        "\n  oracle: ", nftConfig.oracle,
        "\n  jobId: ", nftConfig.jobid,
        "\n  fee: ", nftConfig.fee,
        "\n  url: ", nftConfig.url,
        "\n  path: ", nftConfig.path,
    );
    const txConfig = getTxConfig();
    await waitTx(
        await client.setNode(
            collector.address,
            nftConfig.oracle,
            Web3Utils.asciiToHex(nftConfig.jobid),
            BigInt(nftConfig.fee * 10 ** 18),
            nftConfig.url,
            nftConfig.path,
            txConfig,
        )
    );
});


task("deploy:collector:transfer-right", "CollectPriceCumulative.transferOperationRight")
 .addParam('nft', 'Price for this NFT')
 .setAction(async ({ verify, nft }, hre) => {
    await hre.run('set-DRE');

    const nftConfig = getNFTConfig(nft);

    const client = await getContract('VinciChainlinkClient');
    const collector = await getContract('VinciCollectPriceCumulative', nft);

    console.log(`🔨 Set VinciCollectPriceCumulative operator: ${client.address}.`);
    const txConfig = getTxConfig();
    await waitTx(
        await collector.transferOperationRight(client.address, txConfig)
    );
});
