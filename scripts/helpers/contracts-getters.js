const hre = require("hardhat");
require('dotenv').config();

async function getContract (name, address) {
  if (!address) return null;
  console.log(name + " address already exists:", address);
  return await hre.ethers.getContractAt(name, address);
}

exports.getVinciCollectPriceCumulative = async () => {
  return await getContract(
    "VinciCollectPriceCumulative", 
    (process.env.VINCI_COLLECT_PRICE_CUMULATIVE_ADDRESS || '')
  );
}

exports.getVinciChainlinkClient = async () => {
  return await getContract(
    "VinciChainlinkClient", 
    (process.env.VINCI_CHAINLINK_CLIENT_ADDRESS || '')
  );
}

exports.getVinciCollectAggregator = async () => {
  return await getContract(
    "VinciCollectAggregator", 
    (process.env.VINCI_COLLECT_AGGREGATOR_ADDRESS || '')
  );
}
