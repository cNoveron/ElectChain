pragma solidity ^0.4.17;

import './autorizador_de_direcciones.sol';

contract contador_de_votos{
    // Rinkeby: 
    // Ropsten: 
    // TestRPC: 
    
    // Al desplegar este contrato se creará una tabla de conteos para cada candidato
    // así como el voto nulo.
    mapping(bytes => uint24) conteo_de_candidato_con_apellido;
    
    autorizador_de_direcciones uso_de_autorizador_de_direcciones_para;

    // La llave de la tabla constará del primer apellido de cada uno en formato de bytes.
    // Todos los conteos serán iguales a cero al momento del despliegue del contrato.
    constructor(address donde_reside_el_autorizador_de_direcciones) public{
        conteo_de_candidato_con_apellido["Anaya"]     = 0;
        conteo_de_candidato_con_apellido["López"]     = 0;
        conteo_de_candidato_con_apellido["Meade"]     = 0;
        conteo_de_candidato_con_apellido["Rodríguez"] = 0;
        uso_de_autorizador_de_direcciones_para = autorizador_de_direcciones(donde_reside_el_autorizador_de_direcciones);
    }
    
    // La llamada para la contabilidad de un voto será emitida por el
    // contrato de marcado de votantes, el cual realizará la llamada después
    // de haber marcado al votante por haber emitido un voto.
    function contabilizar_voto(bytes del_candidato)
    external returns(uint24){
        
/*         address unico_autorizado = uso_de_autorizador_de_direcciones_para.conocer_donde_reside("autorizador_de_electores");
        if(unico_autorizado==msg.sender){ */
        // Esta función recordará el conteo actualizado del candidato para
        // usarlo posteriormente, a la hora de emitir una notificación para toda la red.
            uint24 conteo_de_votos_del_candidato = ++ conteo_de_candidato_con_apellido[del_candidato];
        // El conteo del candidato se habrá de actualizar antes de ser recordado.        
        
        // Se emitirá una notificación en la red sobre el cambio en el conteo
        // del candidato especificado y un mensaje adjunto para la ciudadanía.
            emit voto_emitido(
                del_candidato,
                conteo_de_votos_del_candidato
            );
        /* } */
        // Se devolverá como valor de salida el conteo de votos por el candidato.
        return conteo_de_votos_del_candidato;
    }

    function consultar_conteo(bytes del_candidato)
    public view returns(uint24){
        return conteo_de_candidato_con_apellido[del_candidato];
    }

    // El evento emitido será un objeto JSON
    // cuya información podrá ser indexada
    // por medio de las siguientes llaves de texto.
    event voto_emitido(
        bytes por_candidato_de_apellidos,
        uint24 cuyo_conteo_incremento_a
    );

}