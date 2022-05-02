const hre = require("hardhat");

exports.verifyContract = async (contractAddress, ...args) => {
  if (contractAddress == "") return;
  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: args
  });
}

