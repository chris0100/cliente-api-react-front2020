import React, {Fragment, useState} from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import {withRouter} from 'react-router-dom';

function NuevoProducto(props) {

    //producto = state ; guardarProducto = setState
    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: ''
    });

    //archivo = state, guardarAchivo = setState
    const [archivo, guardarArchivo] = useState('');

    //leer los datos del formulario
    const leerInformacionProducto = e => {
        guardarProducto({

            //obtener una copia del state y agregarlo nuevo
            ...producto,
            [e.target.name]: e.target.value
        })
    }

    //coloca la imagen en el state
    const leerArchivo = e => {
        guardarArchivo(e.target.files[0]);
    }


    //almacena el nuevo producto en la base de datos
    const agregarProducto = async e => {
        e.preventDefault();

        //crear un form-data
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        //almacenarlo en la base de datos
        try{
            const result = await clienteAxios.post('/productos', formData, {
               headers: {
                   'Content-Type' : 'multipart/form-data'
               }
            });

            //Lanzar una alerta
            if (result.status === 200){
                Swal.fire(
                    'Agregado Correctamente',
                    result.data.mensaje,
                    'success'
                )
            }

            //redireccionar
            props.history.push('/productos');

        }catch(e){
            console.log(e);
            //lanzar alerta
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'Vuelve a intentarlo'
            })
        }
    }


    //Validar producto
    const validarProducto = () => {
        const {nombre,precio} = producto;
        return !nombre.length || !precio.length
    }


    return (
        <Fragment>
            <h2>Nuevo Producto</h2>

            <form  onSubmit={agregarProducto}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre Producto" name="nombre"
                           onChange={leerInformacionProducto}/>
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input type="number" name="precio" min="0.00" step="0.01" placeholder="Precio"
                           onChange={leerInformacionProducto}/>
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    <input type="file" name="imagen" onChange={leerArchivo}/>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Agregar Producto" disabled={validarProducto()}/>
                </div>
            </form>

        </Fragment>
    )
}

export default withRouter(NuevoProducto);
