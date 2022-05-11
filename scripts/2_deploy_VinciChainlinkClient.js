const {
    Context
} = require('./context');
const Web3Utils = require('web3-utils');


async function main() {
    await Context(async (context, network) => {
        const address = process.env.VINCI_COLLECT_PRICE_CUMULATIVE_ADDRESS;
        const linkTokenAddress = process.env.LINK_ADDRESS;
        if (!address || !linkTokenAddress) {
            throw new Error("VINCI_COLLECT_PRICE_CUMULATIVE_ADDRESS and LINK_ADDRESS must be provided in env.");
        };

        const vinciCollectPriceCumulative = await context.getContract(
            'VinciCollectPriceCumulative',
            address,
        );
        const client = await context.deployContract("VinciChainlinkClient", linkTokenAddress);

        console.log("🔨 setNode ...");
        await client.setNode(
            vinciCollectPriceCumulative.address,
            process.env.ORACLE_ADDRESS,
            Web3Utils.asciiToHex(process.env.JOBID),
            BigInt(process.env.FEE * 10 ** 18),
            process.env.REQUEST_URL,
            process.env.REQUEST_PATH,
        );
        console.log(
            "✔️  VinciChainlinkClient setNode:",
            "\n  vinciCollectPriceCumulative:", vinciCollectPriceCumulative.address,
            "\n  oracle: ", process.env.ORACLE_ADDRESS,
            "\n  jobId: ", process.env.JOBID,
            "\n  fee: ", process.env.FEE,
            "\n  url: ", process.env.REQUEST_URL,
            "\n  path: ", process.env.REQUEST_PATH,
        );

        console.log("🔨 transferOperationRight ...");
        await vinciCollectPriceCumulative.transferOperationRight(client.address);
        console.log(`✔️  Set VinciCollectPriceCumulative operator: ${client.address}.`);


    });
}
main();
