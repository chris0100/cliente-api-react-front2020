import React, {Fragment, useState, useEffect} from "react";
import clienteAxios from "../../config/axios";
//import Swal from "sweetalert2";
import {withRouter} from 'react-router-dom'
import Swal from "sweetalert2";


function EditarCliente(props) {

    //Obtener el ID
    const {id} = props.match.params;


    // cliente = state, guardarCliente = funcion para guardar state
    const [cliente, datosCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: ''
    });



    //Query a la API
    const consultarAPI = async () => {
        const clienteConsulta = await clienteAxios.get(`/clientes/${id}`);

        //colocar en el state
        datosCliente(clienteConsulta.data);
    };



    //USE EFFECT, CUANDO EL COMPONENTE CARGA
    useEffect(() => {
        consultarAPI();
    }, []); //para que no se ejecute varias veces, se le pasa un arreglo vacio





    //leer los datos del formulario
    const actualizarState = e => {
        //Almacenar lo que el usuario escribe en el state
        datosCliente({
            //obtener una copia del state actual
            ...cliente,
            [e.target.name]: e.target.value
        });
    };





    //validar el formulario
    const validarCliente = () => {
        //Destructuring
        const {nombre, apellido, email, empresa, telefono} = cliente;

        //revisar que las propiedades del state tengan contenido
        return !nombre.length || !apellido.length || !email.length || !empresa.length || !telefono.length;
    };

    //Envia una peticion por axios para actualizar el cliente
    const actualizarCliente = e => {
        e.preventDefault();

        //enviar peticion axios
        clienteAxios.put(`/clientes/${id}`, cliente)
            .then(res => {
                //validar si hay errores de mongo
                if (res.data.code === 11000) {
                    Swal.fire({
                        type: 'error',
                        title: 'Operacion invalida!',
                        text: 'El cliente ya se encuentra registrado'
                    });
                }
                else {
                    Swal.fire(
                        'Operacion exitosa!',
                        'Cliente actualizado correctamente',
                        'success'
                    )
                }

                //Redireccionar
                props.history.push('/');
            })
    };






    return (
        <Fragment>
            <h2>Editar Cliente</h2>

            <form onSubmit={actualizarCliente}>

                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre Cliente" name="nombre" onChange={actualizarState}
                           value={cliente.nombre}/>
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input type="text" placeholder="Apellido Cliente" name="apellido" onChange={actualizarState}
                           value={cliente.apellido}/>
                </div>

                <div className="campo">
                    <label>Empresa:</label>
                    <input type="text" placeholder="Empresa Cliente" name="empresa" onChange={actualizarState}
                           value={cliente.empresa}/>
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input type="email" placeholder="Email Cliente" name="email" onChange={actualizarState}
                           value={cliente.email}/>
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input type="text" placeholder="Teléfono Cliente" name="telefono" onChange={actualizarState}
                           value={cliente.telefono}/>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Guardar Cambios" disabled={validarCliente()}/>
                </div>

            </form>

        </Fragment>
    )
}

// HIGHER ORDER COMPONENT ES UNA FUNCION QUE TOMA UN COMPONENT Y RETORNA UN NUEVO COMPONENTE
export default withRouter(EditarCliente);
