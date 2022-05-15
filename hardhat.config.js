require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require('dotenv');
dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: { enabled: true, runs: 1 },
    },
  },
  mocha: {
    timeout: 20000,
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      accounts: 'remote',
      url: 'http://127.0.0.1:8545'
    },
    vinci: {
      chainId: 1337,
      accounts: 'remote',
      url: 'http://18.167.30.221:6357'
    },
    kovan: {
      chainId: 42,
      url: `https://kovan.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.KOVAN_PRIVATE_KEY]
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.KOVAN_PRIVATE_KEY]
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [process.env.BSCTEST_PRIVATE_KEY]
    },
    bscmainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [process.env.BSCMAIN_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      kovan: process.env.ETHERSCAN_KEY,
      bsc: process.env.BSCSCAN_KEY,
    }
  }
};
