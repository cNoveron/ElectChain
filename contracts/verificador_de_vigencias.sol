pragma solidity ^0.4.17;

contract verificador_de_vigencias{
    // Rinkeby: 
    // TestRPC: 
    
    // Al desplegar este contrato se creará un índice de direcciones de cuentas
    // de electores que han sido marcados por haber emitido un único voto.
    mapping(bytes => bool) vigencia_desde_bytes;    

    function consultar_vigencia(bytes de_la_credencial)
    external view returns(bool){
        bool resultado = vigencia_desde_bytes[de_la_credencial];
        emit vigencia_consultada(de_la_credencial,resultado);
        return resultado;
    }

    function testificar_vigencia(bytes de_la_credencial)
    external{
        vigencia_desde_bytes[de_la_credencial] = true;
        emit vigencia_testificada(de_la_credencial);
    }

    event vigencia_testificada(
        bytes para_credencial
    );

    event vigencia_consultada(
        bytes para_credencial,
        bool  cuya_vigencia_es
    );
}