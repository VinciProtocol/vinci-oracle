require("@nomiclabs/hardhat-waffle");
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


const DEFAULT_NETWORK = "hardhat";
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;
const KOVAN_PRIVATE_KEY = process.env.KOVAN_PRIVATE_KEY;
const BSCTEST_PRIVATE_KEY = process.env.BSCTEST_PRIVATE_KEY;
const BSCMAIN_PRIVATE_KEY = process.env.BSCMAIN_PRIVATE_KEY;

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
  defaultNetwork: `${DEFAULT_NETWORK}`,
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
      url: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${KOVAN_PRIVATE_KEY}`]
    },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${KOVAN_PRIVATE_KEY}`]
    },
    bsctestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      accounts: [`${BSCTEST_PRIVATE_KEY}`]
    },
    bscmainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: [`${BSCMAIN_PRIVATE_KEY}`]
    }
  }
};
