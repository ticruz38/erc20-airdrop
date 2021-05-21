import { task, HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
// import "hardhat-gas-reporter";
import "hardhat-typechain";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
export default {
  solidity: {
    settings: {
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.8.3",
      },
      {
        version: "0.5.4",
      },
    ],
  },
  networks: {
    hardhat: {
      gas: 12000000,
      blockGasLimit: 0x1fffffffffffff,
      allowUnlimitedContractSize: true,
      timeout: 1800000,
    },
  },
  // gasReporter: {
  //   currency: "USD",
  //   gasPrice: 50,
  //   coinmarketcap: "e5519458-8154-45b9-827c-9a5bd733fe48",
  // },
  typechain: {
    outDir: "codegen",
  },
} as HardhatUserConfig;
