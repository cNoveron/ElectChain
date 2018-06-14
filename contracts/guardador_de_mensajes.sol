pragma solidity ^0.4.17;

contract guardador_de_mensajes{
    // Rinkeby: 0xe5977A0beF0b28eDFd2e3f79e8c606459E44Ee83
    // TestRPC: 0x6de20b8368d77d014e07c156c0130429700b9a10
    
    // Al desplegar este contrato se creará una tabla de conteos para cada candidato
    // así como el voto nulo.
    string[]    mensajes_de_la_ciudadania;
    // Para extraer todos los mensajes se registrará un conteo de mensajes la lista. 
    uint        indice_del_ultimo_mensaje;
    // 
    constructor() public{
        indice_del_ultimo_mensaje = 0;
    }
    
    function guardar(string el_mensaje)
    external{
        indice_del_ultimo_mensaje = mensajes_de_la_ciudadania.push(el_mensaje)-1;
    }
    
    function conocer_indice_del_ultimo_mensaje()
    external view returns(uint){
        return indice_del_ultimo_mensaje;
    }
    
}