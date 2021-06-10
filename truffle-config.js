var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'holiday scrub knock long plastic early describe comic fix decrease test vanish';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/e77fc38ae79c418fb63fa0214beac51e")
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  },
  compilers: {
    solc: {
      optimizer:{
        enabled: true,
        runs: 200
      }
    }
  }
}
