var guardador_de_mensajes   = artifacts.require("./guardador_de_mensajes.sol")
var contador_de_votos       = artifacts.require("./contador_de_votos.sol")
var verificador_de_vigencias= artifacts.require("./verificador_de_vigencias.sol")
var autorizador_de_electores= artifacts.require("./autorizador_de_electores.sol")

module.exports = function(deployer){

  console.log("2_deploy_contracts.js")
  var contador_de_votos_deployed

  deployer.deploy(guardador_de_mensajes)
  .then(function(guardador_de_mensajes_deployed){
    console.log("guardador_de_mensajes_deployed.address\t\t",guardador_de_mensajes_deployed.address)
    return deployer.deploy(
      contador_de_votos,
      guardador_de_mensajes_deployed.address
    )
  })
  .then(function(resultado){
    contador_de_votos_deployed = resultado
    console.log("contador_de_votos_deployed.address\t\t",contador_de_votos_deployed.address)
    return deployer.deploy(
      verificador_de_vigencias
    )
  })
  .then(function(verificador_de_vigencias_deployed){
    console.log("verificador_de_vigencias.address\t\t",verificador_de_vigencias_deployed.address)
    return deployer.deploy(
      autorizador_de_electores,
      contador_de_votos_deployed.address,
      verificador_de_vigencias_deployed.address
    )
  })  
  .then(function(autorizador_de_electores_deployed){
    console.log("autorizador_de_electores_deployed.address\t",autorizador_de_electores_deployed.address)
  })

}
