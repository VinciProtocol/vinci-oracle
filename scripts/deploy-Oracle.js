// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

const {
  deploy_VinciCollectPriceCumulative,
  deploy_VinciChainlinkClient,
  deploy_VinciCollectAggregator,
} = require("./helpers/contracts-helpers.js");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // 1.1 deploy VinciCollectPriceCumulative:
  console.log("\n1, deploy CollectPriceCumulative: ");
  const vinciCollectPriceCumulative = await deploy_VinciCollectPriceCumulative();


  // 2.1 deploy VinciChainlinkClient:
  console.log("\n2, deploy VinciChainlinkClient: ");
  await deploy_VinciChainlinkClient(vinciCollectPriceCumulative);

  // 3.1 deploy VinciCollectAggregator:
  console.log("\n3, deploy VinciCollectAggregator: ");
  await deploy_VinciCollectAggregator(vinciCollectPriceCumulative);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
