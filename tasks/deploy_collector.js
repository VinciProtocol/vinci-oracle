const {
    task
} = require('hardhat/config');
const Web3Utils = require('web3-utils');

const Config = require('../config');
const {
    deployContract,
    getContractByNFT,
    getContract,
} = require('./helpers');

task("deploy:collector", "Deploy CollectPriceCumulative")
 .addParam('nft', 'Price for this NFT')
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

    const client = await getContract('VinciChainlinkClient');
    if (!client) {
        console.error('Please run `npx hardhat deploy:client` first.');
        process.exit(1);
    };

    const contractName = 'VinciCollectPriceCumulative';

    let contract = await getContractByNFT(contractName, nft);
    if (!contract) {
        contract = await deployContract(
            contractName,
            [
                0,                                          // timeout
                0,                                          // minSubmissionValue
                BigInt('99999999999999999999999999999999'), // maxSubmissionValue
                18,                                         // decimals
                nftConfig.description,                      // description
            ],
            verify,
            nft,
        );
    };

    console.log("🔨 setNode ...");
    await client.setNode(
        contract.address,
        nftConfig.oracle,
        Web3Utils.asciiToHex(nftConfig.jobid),
        BigInt(nftConfig.fee * 10 ** 18),
        nftConfig.url,
        nftConfig.path,
    );
    console.log(
        "✔️  VinciChainlinkClient setNode:",
        "\n  vinciCollectPriceCumulative:", contract.address,
        "\n  oracle: ", nftConfig.oracle,
        "\n  jobId: ", nftConfig.jobid,
        "\n  fee: ", nftConfig.fee,
        "\n  url: ", nftConfig.url,
        "\n  path: ", nftConfig.path,
    );

    console.log("🔨 transferOperationRight ...");
    await contract.transferOperationRight(client.address);
    console.log(`✔️  Set ${contractName} operator: ${client.address}.`);
});
