const hre = require("hardhat");

const {
  getVinciCollectPriceCumulative,
  getVinciCollectAggregator,
  getVinciChainlinkClient,
} = require("./contracts-getters.js");
  
const {
  deployVinciCollectAggregator,
  deployVinciChainlinkClient,
  deployVinciCollectPriceCumulative,
} = require("./contracts-deployments.js")

exports.deploy_VinciCollectPriceCumulative = async () => {
  var vinciCollectPriceCumulative = await getVinciCollectPriceCumulative();
  if (!vinciCollectPriceCumulative) {
    vinciCollectPriceCumulative = await deployVinciCollectPriceCumulative();
  }
  return vinciCollectPriceCumulative;
}

async function initVinciChainlinkClient(vinciChainlinkClient, vinciCollectPriceCumulative) {
  await vinciChainlinkClient.setNode(
      vinciCollectPriceCumulative.address, process.env.ORACLE_ADDRESS, 
      process.env.JOBID, BigInt(process.env.FEE * 10 ** 18), process.env.REQUEST_URL, process.env.REQUEST_PATH);
  console.log("VinciChainlinkClient set Node:",
      "\n  vinciCollectPriceCumulative:", vinciCollectPriceCumulative.address,
      "\n  oracle: ", process.env.ORACLE_ADDRESS, 
      "\n  jobId: ", process.env.JOBID, 
      "\n  fee: ", process.env.FEE, 
      "\n  url: ", process.env.REQUEST_URL, 
      "\n  path: ", process.env.REQUEST_PATH);

  await vinciCollectPriceCumulative.transferOperationRight(vinciChainlinkClient.address);
  console.log("set vinciCollectPriceCumulative operator: ", vinciChainlinkClient.address);
}

exports.deploy_VinciChainlinkClient = async (vinciCollectPriceCumulative) => {
  var vinciChainlinkClient = await getVinciChainlinkClient();
  if (!vinciChainlinkClient) {
    vinciChainlinkClient = await deployVinciChainlinkClient();
    if (!vinciChainlinkClient) {
        console.error("VinciChainlinkClient failed to deploy.");
        return;
    }

    if (vinciCollectPriceCumulative) {
        await initVinciChainlinkClient(vinciChainlinkClient, vinciCollectPriceCumulative);
    }
  }
  return vinciChainlinkClient;
}

async function initVinciCollectAggregator(vinciCollectAggregator, vinciCollectPriceCumulative) {
  await vinciCollectAggregator.setCollector(vinciCollectPriceCumulative.address);
  console.log("set VinciCollectAggregator collector:", vinciCollectPriceCumulative.address);
}

exports.deploy_VinciCollectAggregator = async (vinciCollectPriceCumulative) => {
  var vinciCollectAggregator = await getVinciCollectAggregator();
  if (!vinciCollectAggregator) {
    vinciCollectAggregator = await deployVinciCollectAggregator();
    if (!vinciCollectAggregator) {
        console.error("VinciCollectAggregator failed to deploy.");
        return;
    }

    if (vinciCollectPriceCumulative) {
        await initVinciCollectAggregator(vinciCollectAggregator, vinciCollectPriceCumulative);
    }
  }
  return vinciCollectAggregator;
}
