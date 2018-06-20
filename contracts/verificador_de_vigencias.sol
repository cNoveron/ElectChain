pragma solidity ^0.4.17;

contract verificador_de_vigencias{
    // Rinkeby: 0x35a4bdbc6488f5066228b1c99c7fde5fbbd2639c
    // Ropsten: 
    // TestRPC: 
    
    mapping(bytes => bool) vigencia_desde_bytes;    

    function consultar_vigencia(bytes de_la_credencial)
    external returns(bool){
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