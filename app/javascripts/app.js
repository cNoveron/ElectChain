// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css"

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import autorizador_de_electores_artifacts from '../../build/contracts/autorizador_de_electores.json'
import verificador_de_vigencias_artifacts from '../../build/contracts/verificador_de_vigencias.json'
import contador_de_votos_artifacts from '../../build/contracts/contador_de_votos.json'
import guardador_de_mensajes_artifacts from '../../build/contracts/guardador_de_mensajes.json'
// contador_de_votos is our usable abstraction, which we'll use through the code below.
var 
autorizador_de_electores  = contract(autorizador_de_electores_artifacts),
verificador_de_vigencias  = contract(verificador_de_vigencias_artifacts),
contador_de_votos         = contract(contador_de_votos_artifacts),
guardador_de_mensajes     = contract(guardador_de_mensajes_artifacts)
const 
Web3Utils = require('web3-utils'),
txDecoder = require('ethereum-tx-decoder')
// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts
var account
//

window.App = {

  start: function() {
    var app = this
    // Bootstrap the contador_de_votos abstraction for Use.
    autorizador_de_electores.setProvider(web3.currentProvider)
    verificador_de_vigencias.setProvider(web3.currentProvider)
    contador_de_votos.setProvider(web3.currentProvider)
    guardador_de_mensajes.setProvider(web3.currentProvider)
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
        autorizador_de_electores.defaults({from: account})
        contador_de_votos.defaults({from: account})
        verificador_de_vigencias.defaults({from: account})
        guardador_de_mensajes.defaults({from: account})
        app.placeListeners()
      }
    )
  },

  placeListeners: function(){
    var app = this

    guardador_de_mensajes.deployed()
    .then(function(guardador_de_mensajes_deployed){
      return guardador_de_mensajes_deployed.mensaje_recibido(function(error,log){
        if(!error)
          app.actualizarEstado(
            log.event+" con_contenido "+Web3Utils.toAscii(log.args.con_contenido)
          )
        else
          app.actualizarEstado("error en voto_emitido "+error)
      })
    })

    contador_de_votos.deployed()
    .then(function(contador_de_votos_deployed){
      contador_de_votos_deployed.voto_emitido(function(error,log){
        if(!error)
          app.actualizarEstado(
            log.event+" por_candidato_de_apellidos "+Web3Utils.toAscii(log.args.por_candidato_de_apellidos)+
            " cuyo_conteo_incremento_a "+log.args.cuyo_conteo_incremento_a.c+
            " con_mensaje_adjunto "+Web3Utils.toAscii(log.args.con_mensaje_adjunto)+
            " transactionHash "+log.transactionHash
          )
        else
          app.actualizarEstado("error en voto_emitido "+error)
      })
      return contador_de_votos_deployed
    })
    .then(function(contador_de_votos_deployed){
      contador_de_votos_deployed.contrato_construido(function(error,log){
        if(!error)
          app.actualizarEstado(
            log.event+" con_guardador_en "+log.args.con_guardador_en
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
      return autorizador_de_electores_deployed.elector_autorizado_para_votar(function(error,log){
        if(!error)
          app.actualizarEstado(
            log.event+" al_digerir_su_credencial_se_obtuvo "+log.args.al_digerir_su_credencial_se_obtuvo
          )
        else
          app.actualizarEstado("error en elector_autorizado_para_votar "+error)
      })
    })
    .then(function() {
      return autorizador_de_electores.deployed()
    })
    .then(function(autorizador_de_electores_deployed) {
      return autorizador_de_electores_deployed.elector_no_puede_votar(function(error,log){
        if(!error)
          app.actualizarEstado(
            log.event+" al_digerir_su_credencial_se_obtuvo "+log.args.al_digerir_su_credencial_se_obtuvo
          )
        else
          app.actualizarEstado("error en elector_no_puede_votar "+error)
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
    de_la_credencial = document.getElementById("testificar_vigencia_de_la_credencial").value
    verificador_de_vigencias.deployed()
    .then(function(verificador_de_vigencias_deployed){
      var hash_de_la_credencial = web3.sha3(de_la_credencial)
      return verificador_de_vigencias_deployed.testificar_vigencia(hash_de_la_credencial)
    })
    .catch(function(e){
      app.actualizarEstado("error al testificar_vigencia "+e)
      console.log("error al testificar_vigencia "+e)
    })

  },

  consultar_vigencia: function() {
    var 
    app = this,
    de_la_credencial = document.getElementById("consultar_vigencia_de_la_credencial").value
    verificador_de_vigencias.deployed()
    .then(function(verificador_de_vigencias_deployed){
      var hash_de_la_credencial = web3.sha3(de_la_credencial)
      return verificador_de_vigencias_deployed.consultar_vigencia(hash_de_la_credencial)
    })
    .catch(function(e) {
      app.actualizarEstado("error al consultar_vigencia")
      console.log("error al consultar_vigencia",e)
    })
  },

  procesar_voto: function() {
    var 
    app = this,
    por_el_candidato    = document.getElementById("procesar_voto_por_el_candidato_por_el_candidato").value,
    con_mensaje_adjunto = document.getElementById("procesar_voto_por_el_candidato_con_mensaje_adjunto").value,
    con_credencial      = document.getElementById("procesar_voto_por_el_candidato_con_credencial").value  
    guardador_de_mensajes.deployed()
    .then(function(){
      return contador_de_votos.deployed()
    })
    .then(function(){
      return autorizador_de_electores.deployed()
    })
    .then(function(autorizador_de_electores_deployed){
      var hash_de_la_credencial = Web3Utils.sha3(con_credencial)
      return autorizador_de_electores_deployed.procesar_voto(
        por_el_candidato,
        con_mensaje_adjunto,
        hash_de_la_credencial,
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
    de_la_credencial = "21206852hef80237940z",
    hash_de_la_credencial,
    contador_de_votos_deployed
    verificador_de_vigencias.deployed()
    .then(function(verificador_de_vigencias_deployed){
      hash_de_la_credencial = web3.sha3(de_la_credencial)
      return verificador_de_vigencias_deployed.testificar_vigencia(hash_de_la_credencial)
    })
    .then(function(){
      return guardador_de_mensajes.deployed()
    })
    .then(function(guardador_de_mensajes_deployed){
      guardador_de_mensajes_deployed.guardar("Pudin")
      return contador_de_votos.deployed()
    })
    .then(function(resultado){
      contador_de_votos_deployed = resultado
      return contador_de_votos_deployed.address_de_guardador_de_mensajes()
    })
    .then(function(address_de_guardador_de_mensajes){
      console.log(address_de_guardador_de_mensajes)
      return
    })
    .then(function(){
      return contador_de_votos_deployed.contabilizar_voto(
        "Anaya",
        "Hola"
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
