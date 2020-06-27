import React, {useEffect, useState, Fragment, useContext} from "react";

//importar cliente axios
import clienteAxios from "../../config/axios";
import UnCliente from "./UnCliente";

import {Link,withRouter} from "react-router-dom";
import Spinner from "../layout/Spinner";

//Importar el context
import {CRMContext} from "../../context/CRMContext";

function Clientes(props) {

    //Trabajar con el state
    //clientes = state, guardarClientes = funcion para guardar state
    const [clientes, guardarClientes] = useState([]);

    //Utilizar valores del context
    const [auth,guardarAuth] = useContext(CRMContext);






    // Use effect es similar a componentdidmount y willmount
    useEffect( () => {

        if (auth.token !== ''){
            //Query a la API
            const consultarAPI = async () => {
                try{
                    const clientesConsulta = await clienteAxios.get('/clientes', {
                        headers: {
                            Authorization : `Bearer ${auth.token}`
                        }
                    });

                    //colocar el resultado en el state
                    guardarClientes(clientesConsulta.data);

                }catch (error) {
                    //error con autorizacion
                    if (error.response.status = 500){
                        props.history.push('/iniciar-sesion');
                    }
                }
            }

            //llamado a la API
            consultarAPI();
        }
        else{
            props.history.push('/iniciar-sesion');
        }
    }, [clientes]);


    //Si el state esta como false
    if(!auth.auth){
        props.history.push('/iniciar-sesion');
    }


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
                    />
                ))}
            </ul>

        </Fragment>
    )
}

export default withRouter(Clientes);
