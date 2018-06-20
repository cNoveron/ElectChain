pragma solidity ^0.4.17;

contract autorizador_de_direcciones{
    // Rinkeby: 
    // Ropsten: 
    // TestRPC: 

    mapping(string => address) direccion_desde_nombre;    
    
    function asignar(address donde_reside, string del_contrato)
    external{
        require(msg.sender==0x7ef04eDa8f25222ceff421c76Aba68752ced0773);
        direccion_desde_nombre[del_contrato] = donde_reside;
    }
    
    function conocer_donde_reside(string del_contrato)
    external view returns(address){
        return direccion_desde_nombre[del_contrato];
    }
    
}