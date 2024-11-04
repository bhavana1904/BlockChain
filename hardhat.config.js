require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    localhost: {            // Add this section for Ganache
      url: "http://127.0.0.1:7545",  // RPC URL for Ganache
      chainId: 1337,                 // Ganache's Chain ID
    },
  },
};
