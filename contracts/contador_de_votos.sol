pragma solidity ^0.4.17;

import './guardador_de_mensajes.sol';

contract contador_de_votos{
    // Rinkeby: 0x603780F8774ebC396f99b4e925599D6Ab6B1b84d
    // TestRPC: 
    
    // Al desplegar este contrato se creará una tabla de conteos para cada candidato
    // así como el voto nulo.
    mapping(string => uint24) uint_de_conteo_de_candidato_desde_apellido;
    
    guardador_de_mensajes uso_del_guardador_de_mensajes_para;

    // La llave de la tabla constará del primer apellido de cada uno en formato de string.
    // Todos los conteos serán iguales a cero al momento del despliegue del contrato.
    constructor(address donde_reside_el_guardador_de_mensajes) public{
        uint_de_conteo_de_candidato_desde_apellido["Anaya"]     = 0;
        uint_de_conteo_de_candidato_desde_apellido["López"]     = 0;
        uint_de_conteo_de_candidato_desde_apellido["Meade"]     = 0;
        uint_de_conteo_de_candidato_desde_apellido["Rodríguez"] = 0;
        uso_del_guardador_de_mensajes_para = guardador_de_mensajes(donde_reside_el_guardador_de_mensajes);
    }
    
    // La llamada para la contabilidad de un voto será emitida por el
    // contrato de marcado de votantes, el cual realizará la llamada después
    // de haber marcado al votante por haber emitido un voto.
    function contabilizar_voto(string del_candidato, string con_mensaje_adjunto)
    external returns(uint24){
        
        // Esta función recordará el conteo actualizado del candidato para
        // usarlo posteriormente, a la hora de emitir una notificación para toda la red.
        uint24 conteo_de_votos_del_candidato = 
        // El conteo del candidato se habrá de actualizar antes de ser recordado.
        ++ uint_de_conteo_de_candidato_desde_apellido[del_candidato];
        
        uso_del_guardador_de_mensajes_para.guardar(con_mensaje_adjunto);
        
        // Se emitirá una notificación en la red sobre el cambio en el conteo
        // del candidato especificado y un mensaje adjunto para la ciudadanía.
        emit voto_emitido(
            del_candidato,
            conteo_de_votos_del_candidato,
            con_mensaje_adjunto
        );
        
        // Se devolverá como valor de salida el conteo de votos por el candidato.
        return conteo_de_votos_del_candidato;
    }

    function consultar_conteo(string del_candidato)
    public view returns(uint24){
        return uint_de_conteo_de_candidato_desde_apellido[del_candidato];
    }

    // El evento emitido será un objeto JSON
    // cuya información podrá ser indexada
    // por medio de las siguientes llaves de texto.
    event voto_emitido(
        string por_candidato_de_apellidos,
        uint24 cuyo_conteo_incremento_a,
        string con_mensaje_adjunto
    );

}