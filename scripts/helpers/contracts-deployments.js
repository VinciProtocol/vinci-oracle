const hre = require("hardhat");
const {
  verifyContract,
} = require("./etherscan-verification.js");
require('dotenv').config();

async function deployContract(name, ...args) {
  console.log("starts deployment " + name);
  const Contract = await hre.ethers.getContractFactory(name);
  const contract = await Contract.deploy(...args);
  await contract.deployed();
  console.log(" ++ " + name + " deployed to:", contract.address);

  const verify = process.env.VERIFY || false;
  console.log("verify", verify);
  if (verify) {
    verifyContract(contract.address, ...args);
  }
  return contract;
}

exports.deployVinciCollectPriceCumulative = async () => {
  return await deployContract(
    "VinciCollectPriceCumulative", 
    0, 0, BigInt('99999999999999999999999999999999'), 18, process.env.DESCRIPTION
  );
}

exports.deployVinciChainlinkClient = async () => {
  return await deployContract(
    "VinciChainlinkClient",
    process.env.LINK_ADDRESS
  );
}

exports.deployVinciCollectAggregator = async () => {
  return await deployContract(
    "VinciCollectAggregator",
    0, 0, BigInt('99999999999999999999999999999999'), 18, process.env.TIMEINTERVAL, process.env.DESCRIPTION
  );
}
