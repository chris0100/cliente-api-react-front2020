import React, {Fragment, useState} from "react";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import {withRouter} from 'react-router-dom'


function NuevoCliente({history}) {

    // cliente = state, guardarCliente = funcion para guardar state
    const [cliente, guardarCliente] = useState({
        nombre: '',
        apellido: '',
        empresa: '',
        email: '',
        telefono: ''
    });


    //leer los datos del formulario
    const actualizarState = e => {
        //Almacenar lo que el usuario escribe en el state
        guardarCliente({
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



    //Añade en la REST API un cliente nuevo
    const agregarCliente = e => {
        e.preventDefault();

        //envia peticion
        clienteAxios.post('/clientes', cliente)
            .then(res => {

                //validar si hay errores de mongo
                if (res.data.code === 11000) {
                    Swal.fire({
                        type: 'error',
                        title: 'Operacion invalida!',
                        text: 'El email ya se encuentra registrado'
                    });
                }
                else {
                    Swal.fire(
                        'Operacion exitosa!',
                        res.data.mensaje,
                        'success'
                    )
                }

                //Redireccionar
                history.push('/');

            });
    };






    return (
        <Fragment>
            <h2>Nuevo Cliente</h2>

            <form onSubmit={agregarCliente}>

                <legend>Llena todos los campos</legend>

                <div className="campo">
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre Cliente" name="nombre" onChange={actualizarState}/>
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input type="text" placeholder="Apellido Cliente" name="apellido" onChange={actualizarState}/>
                </div>

                <div className="campo">
                    <label>Empresa:</label>
                    <input type="text" placeholder="Empresa Cliente" name="empresa" onChange={actualizarState}/>
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input type="email" placeholder="Email Cliente" name="email" onChange={actualizarState}/>
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input type="text" placeholder="Teléfono Cliente" name="telefono" onChange={actualizarState}/>
                </div>

                <div className="enviar">
                    <input type="submit" className="btn btn-azul" value="Agregar Cliente" disabled={validarCliente()}/>
                </div>

            </form>

        </Fragment>
    )
}

// HIGHER ORDER COMPONENT ES UNA FUNCION QUE TOMA UN COMPONENT Y RETORNA UN NUEVO COMPONENTE
export default withRouter(NuevoCliente);
