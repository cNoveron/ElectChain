pragma solidity ^0.4.17;

contract guardador_de_mensajes{
    // Rinkeby: 0x1088843ad1ea8667ebfa8c7c1734f106274f4774
    // Ropsten: 
    // TestRPC: 
    
    string[]    mensajes_de_la_ciudadania;
    // Para extraer todos los mensajes se registrará un conteo de mensajes la lista. 
    uint        indice_del_ultimo_mensaje;
    
    constructor() public{
        indice_del_ultimo_mensaje = 0;
    }
    
    function guardar(string el_mensaje)
    external{
        indice_del_ultimo_mensaje = mensajes_de_la_ciudadania.push(el_mensaje)-1;
    }
    
    function obtener_indice_del_ultimo_mensaje()
    external view returns(uint){
        return indice_del_ultimo_mensaje;
    }
    
    function obtener_mensaje(uint en_el_indice)
    external view returns(string){
        return mensajes_de_la_ciudadania[en_el_indice];
    }
    
}