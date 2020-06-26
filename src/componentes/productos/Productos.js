import React, {Fragment, useEffect,useState} from "react";
import {Link} from "react-router-dom";
import clienteAxios from "../../config/axios";
import UnProducto from "./UnProducto";
import Spinner from "../layout/Spinner";

function Productos() {

    // productos = state,  guardarProductos = funcion para guardar el state
    const[productos, guardarProductos] = useState([]);

    //useEffect para consultar API
    useEffect(
        () => {

            //QUERY A LA API
            const consultarAPI = async () => {
                const productosConsulta = await clienteAxios.get('/productos');
                guardarProductos(productosConsulta.data)
            }

            //llamado a la API
            consultarAPI();
        }, [productos]); //hace que se vuelva a cargar el state de productos.


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
