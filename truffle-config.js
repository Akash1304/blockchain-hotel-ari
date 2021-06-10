var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = 'mention foam fox front ankle gold wage powder heart maple nothing history';

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "https://ropsten.infura.io/v3/3a31841620564165a0347e0cdeef446d")
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
