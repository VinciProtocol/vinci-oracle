const {
    Context
} = require('./context');


async function main() {
    await Context(async (context, network) => {
        const address = process.env.VINCI_COLLECT_PRICE_CUMULATIVE_ADDRESS;
        if (!address) {
            throw new Error("VINCI_COLLECT_PRICE_CUMULATIVE_ADDRESS must be provided in env.");
        };

        const vinciCollectPriceCumulative = await context.getContract(
            'VinciCollectPriceCumulative',
            address,
        );
        const aggregator = await context.deployContract(
            "VinciCollectAggregator",
            0,                                          // timeout
            0,                                          // minSubmissionValue
            BigInt('99999999999999999999999999999999'), // maxSubmissionValue
            18,                                         // decimals
            process.env.TIMEINTERVAL,                   // timeInterval
            process.env.DESCRIPTION,                    // description
        );

        console.log("🔨 setCollector ...");
        await aggregator.setCollector(vinciCollectPriceCumulative.address);
        console.log(`✔️  Set VinciCollectAggregator collector: ${vinciCollectPriceCumulative.address}.`);


    });
}
main();
