pragma solidity ^0.4.17;

import './contador_de_votos.sol';
import './verificador_de_vigencias.sol';

contract autorizador_de_electores{
    // Rinkeby: 
    // Ropsten: 
    // TestRPC: 
    
    // Al desplegar este contrato se creará un índice de direcciones de cuentas
    // de electores que han sido marcados por haber emitido un único voto.
    mapping(bytes => bool) marca_de_emision_de_voto_desde_bytes;

    /*  El presente contrato se hará referencia a la instancia de otro contrato 
        llamado */contador_de_votos/*, y para accesar a sus funciones se hará 
        referencia a la instancia de dicho contrato por medio de un identificador
        llamado "*/uso_de_contador_de_votos_para;/*.
        
        El presente contrato se hará referencia a la instancia de otro contrato 
        llamado */verificador_de_vigencias/*, y para accesar a sus funciones se hará 
        referencia a la instancia de dicho contrato por medio de un identificador
        llamado "*/uso_de_verificador_de_vigencias_para;/*.
    */

    constructor(
        address donde_reside_el_contador_de_votos,
        address donde_reside_el_verificador_de_vigencias
    ) 
    public{
    /*  Dicho identificador hace referencia a la única copia del contrato llamado
        */uso_de_contador_de_votos_para/* 
        la única copia del contrato*/ = /* llamado */contador_de_votos/* 
        que se alojará en la dirección */(donde_reside_el_contador_de_votos);/*
        de la red Ropsten de Ethereum.
        
        Se hará */uso_de_verificador_de_vigencias_para/* 
        la única copia del contrato*/ = /* llamado */verificador_de_vigencias/*
        que se alojará en la dirección */(donde_reside_el_verificador_de_vigencias);/*
        de la red Ropsten de Ethereum. 
    */
    }

    function procesar_voto(bytes por_el_candidato, bytes de_credencial)
    external{
        
        if(uso_de_verificador_de_vigencias_para.consultar_vigencia(de_credencial))
            if(marca_de_emision_de_voto_desde_bytes[de_credencial] == false){
                uso_de_contador_de_votos_para.contabilizar_voto(por_el_candidato);
                marca_de_emision_de_voto_desde_bytes[de_credencial] = true;
                emit elector_autorizado(de_credencial);
            }
            else
            {
                emit elector_no_tiene_permiso_de_votar("haber emitido ya un voto haciendo uso",de_credencial);
            }
        else
        {
            emit elector_no_tiene_permiso_de_votar("no haberse comprobado vigencia",de_credencial);
        }
    }

    event elector_autorizado(
        bytes de_credencial
    );
    
    event elector_no_tiene_permiso_de_votar(
        string a_causa_de,
        bytes de_credencial
    );
}