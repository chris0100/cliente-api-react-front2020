import React, {useState,useEffect,Fragment} from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import {withRouter} from 'react-router-dom';
import Spinner from "../layout/Spinner";

function EditarProducto(props) {

    //obtener el ID
    const {id} = props.match.params

    //producto =state, y funcion para actualizar
    const [producto, guardarProducto] = useState({
        nombre: '',
        precio: '',
        imagen: ''
    });

    //archivo = state, guardarAchivo = setState
    const [archivo, guardarArchivo] = useState('');


    //cuando el componnte carga
    useEffect(() => {
        //consultar la api para traer el producto a editar, podria estar tambien
        //adentro del useEffect
        const consultarAPI = async () => {
            const productoConsulta = await clienteAxios.get(`/productos/${id}`);
            guardarProducto(productoConsulta.data);
        }

        consultarAPI();
    },[]);



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


    //extraer los valores del state
    const {nombre, precio, imagen} = producto;


    //Edita un producto en la base de datos
    const editarProducto = async e => {
        e.preventDefault();

        //crear un form-data
        const formData = new FormData();
        formData.append('nombre', producto.nombre);
        formData.append('precio', producto.precio);
        formData.append('imagen', archivo);

        //almacenarlo en la base de datos
        try{
            const result = await clienteAxios.put(`/productos/${id}`, formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            });

            //Lanzar una alerta
            if (result.status === 200){
                Swal.fire(
                    'Editado Correctamente',
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



    return(
        <Fragment>
            <h2>Editar Producto</h2>

            <form onSubmit={editarProducto}>
                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre Producto" name="nombre"
                           onChange={leerInformacionProducto} defaultValue={nombre}/>
                </div>

                <div className="campo">
                    <label>Precio:</label>
                    <input type="number" name="precio" min="0.00" step="0.01" placeholder="Precio"
                           onChange={leerInformacionProducto} defaultValue={precio}/>
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    {imagen ? (
                        <img src={`http://localhost:5001/${imagen}`} alt="imagen" width="300"/>
                    ) : null }
                    <input type="file" name="imagen" onChange={leerArchivo}/>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Editar Producto" />
                </div>
            </form>

        </Fragment>
    )
}

export default EditarProducto;
