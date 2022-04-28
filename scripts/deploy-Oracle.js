// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");
require('dotenv').config();

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // 1.1 deploy VinciCollectPriceCumulative
  const VinciCollectPriceCumulative = await hre.ethers.getContractFactory("VinciCollectPriceCumulative");
  const vinciCollectPriceCumulative = await VinciCollectPriceCumulative.deploy(
    0, 0, BigInt('99999999999999999999999999999999'), 18, process.env.DESCRIPTION);
  await vinciCollectPriceCumulative.deployed();
  
  console.log(" ++ VinciCollectPriceCumulative deployed to:", vinciCollectPriceCumulative.address);

  // 2.1 deploy VinciChainlinkClient:
  const VinciChainlinkClient = await hre.ethers.getContractFactory("VinciChainlinkClient");
  const vinciChainlinkClient = await VinciChainlinkClient.deploy(process.env.LINK_ADDRESS);
  await vinciChainlinkClient.deployed();
  console.log(" ++ VinciChainlinkClient deployed to:", vinciChainlinkClient.address);

  // 2.2 set node
  await vinciChainlinkClient.setNode(
    vinciCollectPriceCumulative.address, process.env.ORACLE_ADDRESS, 
    process.env.JOBID, BigInt(process.env.FEE * 10 ** 18), process.env.REQUEST_URL, process.env.REQUEST_PATH);
  console.log("VinciChainlinkClient set Node: \n  vinciCollectPriceCumulative:", vinciCollectPriceCumulative.address,
    "\n  oracle: ", process.env.ORACLE_ADDRESS, 
    "\n  jobId: ", process.env.JOBID, 
    "\n  fee: ", process.env.FEE, 
    "\n  url: ", process.env.REQUEST_URL, 
    "\n  path: ", process.env.REQUEST_PATH);

  // 2.3 transferOperationRight
  await vinciCollectPriceCumulative.transferOperationRight(vinciChainlinkClient.address);
  console.log("set vinciCollectPriceCumulative operator: ", vinciChainlinkClient.address);

  // 3.1 deploy VinciCollectAggregator:
  const VinciCollectAggregator = await hre.ethers.getContractFactory("VinciCollectAggregator");
  const vinciCollectAggregator = await VinciCollectAggregator.deploy(
      0, 0, BigInt('99999999999999999999999999999999'), 18, process.env.TIMEINTERVAL, process.env.DESCRIPTION);
  await vinciCollectAggregator.deployed();
  await vinciCollectAggregator.disableAccessCheck();
  console.log(" ++ VinciCollectAggregator deployed to:", vinciCollectAggregator.address);

  // 3.2 set collector
  await vinciCollectAggregator.setCollector(vinciCollectPriceCumulative.address);
  console.log("set VinciCollectAggregator collector:", vinciCollectPriceCumulative.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
