import React from "react";
import {Link} from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";


function UnProducto({obj}) {

    //Elimina un producto
    const eliminarProducto = id => {
        Swal.fire({
            title: 'Esta seguro?',
            text: "Esta accion no podra ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {

            if (result.value) {
                //eliminar la rest api
                clienteAxios.delete(`/productos/${id}`)
                    .then(res => {
                        if (res.status === 200) {
                            Swal.fire(
                                'Eliminado!',
                                res.data.mensaje,
                                'success'
                            )
                        }
                    })
            }
        })
    }






    return (
        <li className="producto">
            <div className="info-producto">
                <p className="nombre">{obj.nombre}</p>
                <p className="precio">$ {obj.precio}</p>

                {
                    obj.imagen ? (
                        <img src={`http://localhost:5001/${obj.imagen}`} alt="imagen"/>
                    ) : null
                }

            </div>
            <div className="acciones">
                <Link to={`/productos/editar/${obj._id}`} className="btn btn-azul">
                    <i className="fas fa-pen-alt"></i>
                    Editar Producto
                </Link>

                <button type="button" className="btn btn-rojo btn-eliminar"
                        onClick={() => eliminarProducto(obj._id)}>
                    <i className="fas fa-times"></i>
                    Eliminar Producto
                </button>
            </div>
        </li>
    )
}

export default UnProducto;
