pragma solidity ^0.4.17;

contract autorizador_de_direcciones{
    // Rinkeby: 
    // Ropsten: 
    // TestRPC: 

    mapping(string => address) direccion_desde_nombre;    
    
    function asignar(address donde_reside, string del_contrato)
    external{
        require(msg.sender==0xC7e76e5f1D33BE441E890a7F2aCE9468f40345C7);
        direccion_desde_nombre[del_contrato] = donde_reside;
    }
    
    function conocer_donde_reside(string del_contrato)
    external view returns(address){
        return direccion_desde_nombre[del_contrato];
    }
    
}