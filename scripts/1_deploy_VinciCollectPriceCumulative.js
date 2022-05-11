const {
    Context
} = require('./context');


async function main() {
    await Context(async (context, network) => {
        await context.deployContract(
            "VinciCollectPriceCumulative", 
            0,                                          // timeout
            0,                                          // minSubmissionValue
            BigInt('99999999999999999999999999999999'), // maxSubmissionValue
            18,                                         // decimals
            process.env.DESCRIPTION,                    // description
        );
    });
}
main();
