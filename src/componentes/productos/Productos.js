import React, {Fragment, useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import clienteAxios from "../../config/axios";
import UnProducto from "./UnProducto";
import Spinner from "../layout/Spinner";

//importar el context
import {CRMContext} from "../../context/CRMContext";

function Productos(props) {

    // productos = state,  guardarProductos = funcion para guardar el state
    const[productos, guardarProductos] = useState([]);

    //UTILIZA LOS VALORES DEL CONTEXT
    const[auth,guardarAuth] = useContext(CRMContext);

    //useEffect para consultar API
    useEffect(
        () => {

            if (auth.token !== ''){
                //QUERY A LA API
                const consultarAPI = async () => {
                    try{
                        const productosConsulta = await clienteAxios.get('/productos', {
                            headers : {
                                Authorization : `Bearer ${auth.token}`
                            }
                        });
                        guardarProductos(productosConsulta.data)
                    }catch(error){
                        //Error con authorization
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
        }, [productos]); //hace que se vuelva a cargar el state de productos.


    //Si el state esta como false
    if(!auth.auth){
        props.history.push('/iniciar-sesion');
    }


    //Spinner de carga
    if(!productos.length) return <Spinner/>








    return(
        <Fragment>

            <h2>Productos</h2>

            <Link to={'/productos/nuevo'} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            <ul className="listado-productos">
                {productos.map( obj => (
                    <UnProducto
                        key={obj._id}
                        obj={obj}
                    />
                ))}
            </ul>

        </Fragment>
    )
}

export default Productos;
