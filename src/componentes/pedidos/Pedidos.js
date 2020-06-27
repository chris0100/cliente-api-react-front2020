import React, {useEffect,useState, Fragment} from "react";
import clienteAxios from "../../config/axios";
import DetallesPedido from "./DetallesPedido";



function Pedidos() {

    const [pedidos, guardarPedidos] = useState([]);
    useEffect(() => {

        //consultar la API
        const consultarAPI = async () => {

            //obtener los pedidos
            const resultado = await clienteAxios.get('/pedidos');
            guardarPedidos(resultado.data);
        }

        consultarAPI();
    },[])

    return(
       <Fragment>
           <h2>Pedidos</h2>

           <ul className="listado-pedidos">
               {pedidos.map(obj => (
                   <DetallesPedido
                       key={obj._id}
                       obj={obj}
                   />
               ))}
           </ul>
       </Fragment>
    )
}

export default Pedidos;
