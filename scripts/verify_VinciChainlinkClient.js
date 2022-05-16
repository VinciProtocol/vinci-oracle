const {
    Context
} = require('./context');


async function main() {
    await Context(async (context, network) => {

        if (!process.env.LINK_ADDRESS || !process.env.VINCI_CHAINLINK_CLIENT_ADDRESS) {
            throw new Error("VINCI_CHAINLINK_CLIENT_ADDRESS and LINK_ADDRESS must be provided in env.");
        };

        await context.verifyContract(
            "VinciChainlinkClient",
            process.env.VINCI_CHAINLINK_CLIENT_ADDRESS,
            process.env.LINK_ADDRESS,
        );
    });
}
main();
