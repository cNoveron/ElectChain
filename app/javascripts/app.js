// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3 } from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import autorizador_de_electores_artifacts from '../../build/contracts/autorizador_de_electores.json'
import verificador_de_vigencias_artifacts from '../../build/contracts/verificador_de_vigencias.json'
import contador_de_votos_artifacts from '../../build/contracts/contador_de_votos.json'
import guardador_de_mensajes_artifacts from '../../build/contracts/guardador_de_mensajes.json'

// contador_de_votos is our usable abstraction, which we'll use through the code below.
var autorizador_de_electoress = contract(autorizador_de_electores_artifacts);
var verificador_de_vigencias = contract(verificador_de_vigencias_artifacts);
var contador_de_votos = contract(contador_de_votos_artifacts);
var guardador_de_mensajes = contract(guardador_de_mensajes_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var html_element = this;

    // Bootstrap the contador_de_votos abstraction for Use.
    autorizador_de_electores.setProvider(web3.currentProvider);
    verificador_de_vigencias.setProvider(web3.currentProvider);
    contador_de_votos.setProvider(web3.currentProvider);
    guardador_de_mensajes.setProvider(web3.currentProvider);

    html_element.getAccounts()
  },

  getAccounts: function(){
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(
      function(err, passed_accounts) {        
        if (err != null) {
          alert("There was an error fetching your accounts.")
          return
        }
        if (passed_accounts.length == 0) {
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
          return
        }
        accounts  = passed_accounts
        account   = accounts[0]
        html_element.refreshBalance()
      }
    )
  },

  setStatus: function(message) {
    var status = document.getElementById("status")
    status.innerHTML = message
  },

  refreshBalance: function(){
    var html_element = this
    var meta
    contador_de_votos.deployed()
    .then(function(instance){
      meta = instance
      return meta.getBalance.call(account, {from: account})
    })
    .then(function(value){
      var balance_element = document.getElementById("balance")
      balance_element.innerHTML = value.valueOf()
    })
    .catch(function(e){
      console.log(e)
      html_element.setStatus("Error getting balance; see log.")
    })
  },

  sendCoin: function() {
    var html_element = this

    var amount = parseInt(document.getElementById("amount").value)
    var receiver = document.getElementById("receiver").value

    this.setStatus("Initiating transaction... (please wait)")

    var meta;
    contador_de_votos.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      html_element.setStatus("Transaction complete!");
      html_element.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      html_element.setStatus("Error sending coin; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 contador_de_votos, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
