pragma solidity ^0.4.17;

import './contador_de_votos.sol';
import './verificador_de_vigencias.sol';

contract autorizador_de_electores{
    // Rinkeby: 0xc6d42cfdb3e8d141c5fcb676ca3e181c10bf654c
    // TestRPC: 
    
    // Al desplegar este contrato se creará un índice de direcciones de cuentas
    // de electores que han sido marcados por haber emitido un único voto.
    mapping(bytes => bool) marca_de_emision_de_voto_desde_bytes;
    bytes[] hashes_de_credencial;
    

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
        */uso_de_contador_de_votos_para/*  */= contador_de_votos/* 
        que se alojará en la dirección */(donde_reside_el_contador_de_votos);/*
        de la red Ropsten de Ethereum.
        
        Se hará */uso_de_verificador_de_vigencias_para/* 
        la única copia del contrato llamado */= verificador_de_vigencias/*
        que se alojará en la dirección */(donde_reside_el_verificador_de_vigencias);/*
        de la red Ropsten de Ethereum. 
    */
    }

    function procesar_voto(string del_candidato, string con_mensaje_adjunto, bytes de_credencial)
    external{

        hashes_de_credencial.push(de_credencial);
        if(uso_de_verificador_de_vigencias_para.consultar_vigencia(de_credencial))
            if(
                /* Es requisito que el elector no haya votado aún, */
                marca_de_emision_de_voto_desde_bytes[de_credencial] == false
            ){
                /* para */uso_de_contador_de_votos_para.contabilizar_voto(del_candidato,con_mensaje_adjunto);
                
                // Se cambiará el valor del campo de emisión de voto del elector de falso a verdadero,
                // ésto indica que la cuenta del elector ya votó y no puede volver a votar.
                marca_de_emision_de_voto_desde_bytes[de_credencial] = true;
                emit elector_autorizado(de_credencial);
            }
            else
            {
                emit elector_vetado("haber emitido ya un voto",de_credencial);
            }
    }

    event elector_autorizado(
        bytes al_digerir_su_credencial_se_obtuvo
    );
    
    event elector_vetado(
        string a_causa_de,
        bytes al_digerir_su_credencial_se_obtuvo
    );

    function ver_hash(uint del_indice)
    external view returns(bytes){

        return hashes_de_credencial[del_indice];
    }
}