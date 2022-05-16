const {
    Context
} = require('./context');


async function main() {
    await Context(async (context, network) => {

        if ( !process.env.VINCI_COLLECT_AGGREGATOR_ADDRESS) {
            throw new Error("VINCI_COLLECT_AGGREGATOR_ADDRESS must be provided in env.");
        };

        await context.verifyContract(
            "VinciCollectAggregator",
            process.env.VINCI_COLLECT_AGGREGATOR_ADDRESS,
            0,                                          // timeout
            0,                                          // minSubmissionValue
            BigInt('99999999999999999999999999999999'), // maxSubmissionValue
            18,                                         // decimals
            process.env.TIMEINTERVAL,                   // timeInterval
            process.env.DESCRIPTION,                    // description
        );
    });
}
main();
