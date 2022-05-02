// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
require('dotenv').config();

const {
  verifyContract
} = require("./helpers/etherscan-verification.js");

verify_VinciCollectPriceCumulative = async () => {
  const address = process.env.VINCI_COLLECT_PRICE_CUMULATIVE_ADDRESS || '';
  verifyContract(address, 0, 0, BigInt('99999999999999999999999999999999'), 18, process.env.DESCRIPTION);
}

verify_VinciChainlinkClient = async () => {
  const address = process.env.VINCI_CHAINLINK_CLIENT_ADDRESS || '';
  verifyContract(address, process.env.LINK_ADDRESS);
}

verify_VinciCollectAggregator = async () => {
  const address = process.env.VINCI_COLLECT_AGGREGATOR_ADDRESS || '';
  verifyContract(address, 0, 0, BigInt('99999999999999999999999999999999'), 18, process.env.TIMEINTERVAL, process.env.DESCRIPTION);
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // 1.1 verify VinciCollectPriceCumulative:
  console.log("\n1, verify CollectPriceCumulative: ");
  await verify_VinciCollectPriceCumulative();

  // 2.1 verify VinciChainlinkClient:
  console.log("\n2, verify VinciChainlinkClient: ");
  await verify_VinciChainlinkClient();

  // 3.1 verify VinciCollectAggregator:
  console.log("\n3, verify VinciCollectAggregator: ");
  await verify_VinciCollectAggregator();

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
