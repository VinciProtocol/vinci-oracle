require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
const dotenv = require('dotenv');
dotenv.config();

require('./tasks/set-DRE');
require('./tasks/accounts');
require('./tasks/1_deploy_client');
require('./tasks/2_deploy_collector');
require('./tasks/3_deploy_aggregator');

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
    mainnet: {
      chainId: 1,
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts: [process.env.MAINNET_PRIVATE_KEY]
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
      mainnet: process.env.ETHERSCAN_KEY,
    }
  }
};
