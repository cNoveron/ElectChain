// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css"

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import guardador_de_mensajes_artifacts      from '../../build/contracts/guardador_de_mensajes.json'
import autorizador_de_direcciones_artifacts from '../../build/contracts/autorizador_de_direcciones.json'
import contador_de_votos_artifacts          from '../../build/contracts/contador_de_votos.json'
import verificador_de_vigencias_artifacts   from '../../build/contracts/verificador_de_vigencias.json'
import autorizador_de_electores_artifacts   from '../../build/contracts/autorizador_de_electores.json'
// contador_de_votos is our usable abstraction, which we'll use through the code below.
var 
guardador_de_mensajes     = contract(guardador_de_mensajes_artifacts),
autorizador_de_direcciones= contract(autorizador_de_direcciones_artifacts),
contador_de_votos         = contract(contador_de_votos_artifacts),
verificador_de_vigencias  = contract(verificador_de_vigencias_artifacts),
autorizador_de_electores  = contract(autorizador_de_electores_artifacts)
const 
Web3Utils = require('web3-utils'),
txDecoder = require('ethereum-tx-decoder')
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts
var account

window.App = {

  start: function() {
    var app = this
    // Bootstrap the contador_de_votos abstraction for Use.
    guardador_de_mensajes.setProvider(web3.currentProvider)
    autorizador_de_direcciones.setProvider(web3.currentProvider)
    contador_de_votos.setProvider(web3.currentProvider)
    verificador_de_vigencias.setProvider(web3.currentProvider)
    autorizador_de_electores.setProvider(web3.currentProvider)
    app.getAccounts()
  },

  getAccounts: function(){
    var app = this
    web3.eth.getAccounts(
      function(err, passed_accounts){
        console.log("passed_accounts",passed_accounts)
        if (err != null) {
          alert("There was an error fetching your accounts.")
          console.log("There was an error fetching your accounts.")
          return
        }
        if (passed_accounts.length == 0){
          alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
          console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
          return
        }
        accounts  = passed_accounts
        account   = accounts[0]
        guardador_de_mensajes.defaults({from: account})
        autorizador_de_direcciones.defaults({from: account})
        contador_de_votos.defaults({from: account})
        verificador_de_vigencias.defaults({from: account})
        autorizador_de_electores.defaults({from: account})
        app.placeListeners()
      }
    )
  },

  placeListeners: function(){
    var app = this

    contador_de_votos.deployed()
    .then(function(contador_de_votos_deployed){
      contador_de_votos_deployed.voto_emitido(function(error,log){
        if(!error)
          app.actualizarEstado(
            log.event+" por_candidato_de_apellidos "+Web3Utils.toAscii(log.args.por_candidato_de_apellidos)+
            " cuyo_conteo_incremento_a "+log.args.cuyo_conteo_incremento_a.c+
            " transactionHash "+log.transactionHash
          )
        else
          app.actualizarEstado("error en voto_emitido "+error)
      })
      return contador_de_votos_deployed
    })

    verificador_de_vigencias.deployed()
    .then(function(verificador_de_vigencias_deployed){
      verificador_de_vigencias_deployed.vigencia_testificada(function(error,log){
        if(!error)          
          app.actualizarEstado(
            ""+log.event+" para_credencial "+log.args.para_credencial
          )
        else
          app.actualizarEstado("error en vigencia_testificada"+error)
      })
      return verificador_de_vigencias_deployed
    })
    .then(function(verificador_de_vigencias_deployed) {
      return verificador_de_vigencias_deployed.vigencia_consultada(function(error,log){
        if(!error)
          app.actualizarEstado(
            log.event+" para_credencial "+log.args.para_credencial+
            " cuya_vigencia_es "+log.args.cuya_vigencia_es
          )
        else
          app.actualizarEstado("error en vigencia_consultada "+error)
      })
    })

    autorizador_de_electores.deployed()
    .then(function(autorizador_de_electores_deployed) {
      return autorizador_de_electores_deployed.elector_autorizado(function(error,log){
        if(!error)
          app.actualizarEstado(
            log.event+" de_credencial "+log.args.de_credencial
          )
        else
          app.actualizarEstado("error en elector_autorizado "+error)
      })
    })
    .then(function() {
      return autorizador_de_electores.deployed()
    })
    .then(function(autorizador_de_electores_deployed) {
      return autorizador_de_electores_deployed.elector_no_tiene_permiso_de_votar(function(error,log){
        if(!error)
          app.actualizarEstado(
            log.event+" a_causa_de "+log.args.a_causa_de+" de_credencial "+log.args.de_credencial
          )
        else
          app.actualizarEstado("error en elector_no_tiene_permiso_de_votar "+error)
      })
    })
    .then(function() {
      app.test()
    })
  },

  actualizarEstado: function(message){
    var status = document.getElementById("status")
    status.insertAdjacentHTML('beforeend',"<p>"+message)
  },

  testificar_vigencia: function(){
    var 
    app = this,
    OCR = document.getElementById("OCR").value
    verificador_de_vigencias.deployed()
    .then(function(verificador_de_vigencias_deployed){
      var hash_OCR = web3.sha3(OCR)
      return verificador_de_vigencias_deployed.testificar_vigencia(hash_OCR)
    })
    .catch(function(e){
      app.actualizarEstado("error al testificar_vigencia "+e)
      console.log("error al testificar_vigencia "+e)
    })

  },

  consultar_vigencia: function() {
    var 
    app = this,
    OCR = document.getElementById("OCR").value
    verificador_de_vigencias.deployed()
    .then(function(verificador_de_vigencias_deployed){
      var hash_OCR = web3.sha3(OCR)
      return verificador_de_vigencias_deployed.consultar_vigencia(hash_OCR)
    })
    .catch(function(e) {
      app.actualizarEstado("error al consultar_vigencia")
      console.log("error al consultar_vigencia",e)
    })
  },

  procesar_voto: function(por_el_candidato) {
    var 
    app = this,
    OCR = document.getElementById("OCR").value
    autorizador_de_electores.deployed()
    .then(function(autorizador_de_electores_deployed){
      var hash_OCR = Web3Utils.sha3(OCR)
      return autorizador_de_electores_deployed.procesar_voto(
        por_el_candidato,
        hash_OCR,
        {from: accounts[1]}
      )
    })
    .catch(function(e) {
      app.actualizarEstado("error al procesar_voto")
      console.log("error al procesar_voto",e)
    })
  },

  test: function() {
    var 
    app = this,
    OCR = "21206852hef80237940z",
    autorizador_de_electores_deployed,
    hash_OCR
    verificador_de_vigencias.deployed()
    .then(function(verificador_de_vigencias_deployed){
      hash_OCR = web3.sha3(OCR)
      return verificador_de_vigencias_deployed.testificar_vigencia(hash_OCR)
    })
    .then(function(){
      return autorizador_de_electores.deployed()
    })
    .then(function(resultado){
      autorizador_de_electores_deployed = resultado
      return autorizador_de_direcciones.deployed()
    })
    .then(function(autorizador_de_direcciones_deployed){
      return autorizador_de_direcciones_deployed.asignar(
        autorizador_de_electores_deployed.address,
        "autorizador_de_electores"
      )
    })
    .then(function(){
      return autorizador_de_electores_deployed.procesar_voto(
        "Anaya",
        hash_OCR
      )
    })
    .catch(function(e) {
      app.actualizarEstado("test: error al procesar_voto "+e)
      console.log("test: error al procesar_voto",e)
    })
  }
}

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  var Web3 = require('web3')
  window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
  // window.web3 = new Web3(new Web3.providers.HttpProvider("https://infuranet.infura.io/eQMiMPMRRHoldZ7uH7U9"))

  App.start()
})
