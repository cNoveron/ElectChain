var guardador_de_mensajes   = artifacts.require("./guardador_de_mensajes.sol")
var contador_de_votos       = artifacts.require("./contador_de_votos.sol")
var verificador_de_vigencias= artifacts.require("./verificador_de_vigencias.sol")
var autorizador_de_electores= artifacts.require("./autorizador_de_electores.sol")


var Web3 = require('web3')
var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545")
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider)
}
else{
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
}

contract('autorizador_de_electores', function(accounts) {

  function print_elector_autorizado(error,log){
    if(!error){
      console.log(
        log.event,
        "\nal_digerir_su_credencial_se_obtuvo :",log.args.al_digerir_su_credencial_se_obtuvo,
        "\n"
      )
    }
  }

  function print_elector_vetado(error,log){
    if(!error){
      console.log(
        log.event,"a_causa_de",log.args.a_causa_de,
        "\nal_digerir_su_credencial_se_obtuvo :",log.args.al_digerir_su_credencial_se_obtuvo,
        "\n"
      )
    }
  }
  
  function print_voto_emitido(error,log){
    if(!error)
      console.log(
        log.event,"por_candidato_de_apellidos",log.args.por_candidato_de_apellidos,
        "\ncuyo_conteo_incremento_a",log.args.cuyo_conteo_incremento_a.c,
        "\ncon_mensaje_adjunto :",log.args.con_mensaje_adjunto,
        "\ntransactionHash :",log.transactionHash,
        "\n"
      )
  }

  function print_vigencia_testificada(error,log){
    if(!error){
      console.log(
        log.event,"para_credencial",log.args.para_credencial,
        "\n"
      )
    }
  }

  function print_vigencia_consultada(error,log){
    if(!error){
      console.log(
        log.event,"para_credencial",log.args.para_credencial,
        "cuya_vigencia_es",log.args.cuya_vigencia_es,
        "\n"
      )
    }
  }

  function deploy_dependientes(){
    return guardador_de_mensajes.deployed()
    .then(function(){
      return contador_de_votos.deployed()
    })
    .then(function(contador_de_votos_deployed){
      return contador_de_votos_deployed.voto_emitido(print_voto_emitido)
    })
    .then(function(){
      return verificador_de_vigencias.deployed()
    })
  }

  function repeat(func, times) {
    func();
    --times && repeat(func, times);
  }

  it("debería emitir voto fallido al segundo voto emitido",function(){
    var autorizador_de_electores_deployed
    var primero_del_padron = 0x48716ad928da
    return deploy_dependientes()
    .then(function(verificador_de_vigencias_deployed){
      verificador_de_vigencias_deployed.vigencia_consultada(print_vigencia_consultada)
      verificador_de_vigencias_deployed.vigencia_testificada(print_vigencia_testificada)
      return verificador_de_vigencias_deployed
    })
    .then(function(verificador_de_vigencias_deployed){
        repeat(()=>{
          verificador_de_vigencias_deployed.testificar_vigencia(""+primero_del_padron++)
        },
        25
      )
      verificador_de_vigencias_deployed.testificar_vigencia('0x67345328ccad2347ee')
      return 
    })
    .then(function(){
      return autorizador_de_electores.deployed()
    })
    .then(function(resultado){
      autorizador_de_electores_deployed = resultado 
      return autorizador_de_electores_deployed.elector_autorizado(print_elector_autorizado)
    })
    .then(function(){
      return autorizador_de_electores_deployed.elector_vetado(print_elector_vetado)
    })
    .then(function(){
      primero_del_padron = 0x48716ad928da
      repeat(()=>
        autorizador_de_electores_deployed.procesar_voto(
          "Meade","Porque si no, me quitan el empleo",(primero_del_padron++)
        ),
        10
      )
      repeat(()=>
        autorizador_de_electores_deployed.procesar_voto(
          "Anaya","Porque AMLO es un peligro",(primero_del_padron++)
        ),
        10
      )
      repeat(()=>
        autorizador_de_electores_deployed.procesar_voto(
          "López","Porque ya estamos hartos de la corrupción",(primero_del_padron++)
        ),
        4
      )
      autorizador_de_electores_deployed.procesar_voto(
        "Rodríguez","Porque chinguesumadre xdxd",--primero_del_padron
      )
      return 
    })
  })
})
