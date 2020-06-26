import React, {useEffect, useState, Fragment} from "react";

//importar cliente axios
import clienteAxios from "../../config/axios";
import UnCliente from "./UnCliente";

import {Link} from "react-router-dom";
import Spinner from "../layout/Spinner";

function Clientes() {

    //Trabajar con el state
    //clientes = state, guardarClientes = funcion para guardar state
    const [clientes, guardarClientes] = useState([]);

    //Query a la API
    const consultarAPI = async () => {
      const clientesConsulta = await clienteAxios.get('/clientes');

      //colocar el resultado en el state
        guardarClientes(clientesConsulta.data);
    };

    // Use effect es similar a componentdidmount y willmount
    useEffect( () => {
       consultarAPI();
    }, []);


    //Carga el Spinner
    if(!clientes.length) return <Spinner/>



    return(
        <Fragment>

            <h2>Clientes</h2>

            <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente">
                <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>

            <ul className="listado-clientes">
                {clientes.map(obj => (
                    <UnCliente
                        key={obj._id}
                        obj={obj}
                        consultarAPI={consultarAPI}
                    />
                ))}
            </ul>

        </Fragment>
    )
}

export default Clientes;
