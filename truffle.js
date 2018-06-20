// Allows us to use ES6 in our migrations and tests.
var 
HDWalletProvider = require("truffle-hdwallet-provider"),
mnemonic = "chicken dish obvious garden quit child staff cinnamon disagree ribbon link online demand success venture"

require('babel-register');
module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*' // Match any network id
    }/* ,
    INFURAnet: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://infuranet.infura.io/eQMiMPMRRHoldZ7uH7U9",0)
      },
      network_id: '*'
    } */
  }
}
