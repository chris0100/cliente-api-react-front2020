import React,{useState,useEffect,Fragment} from "react";
import clienteAxios from "../../config/axios";
import FormBuscarProducto from "./FormBuscarProducto";
import Swal from "sweetalert2";
import FormCantidadProducto from "./FormCantidadProducto";
import {withRouter} from 'react-router-dom';

function NuevoPedido(props) {

    //extraer el id de cliente
    const {idCliente} = props.match.params;

    //state
    const[cliente,guardarCliente] = useState({});
    const [busqueda, guardarBusqueda] = useState('');
    const [productos, guardarProductos] = useState([]);
    const [total, guardarTotal] = useState(0);


    //actualizar la pagina
    useEffect(() => {
        //obtener el cliente
        const consultarAPI = async () => {
            //consultar el cliente actual
            const resultado = await clienteAxios.get(`/clientes/${idCliente}`);
            guardarCliente(resultado.data);
        }
        //llamar a la API
        consultarAPI();

        //actualizar el total continuamente
        actualizarTotal();
    }, [productos]);



    //realiza la busqueda del producto en api
    const buscarProducto = async e => {
        e.preventDefault();

        //obtener los productos de la busqueda
        const resultadosBusqueda = await clienteAxios.post(`/productos/busqueda/${busqueda}`);


        //valida si existen resultados
        if(resultadosBusqueda.data[0]){
            let productoResultado = resultadosBusqueda.data[0];

            //agregar la llave producto (copia de id)
            productoResultado.producto = resultadosBusqueda.data[0]._id;
            productoResultado.cantidad = 0;

            //ponerlo en el state
            guardarProductos([...productos, productoResultado]);
        }
        else{
            //no hay resultados
            Swal.fire({
                type: 'error',
                title: 'No hay resultados',
                text: 'Intenta otra busqueda'
            });
        }
    }




    //almacenar la busqueda en el state
    const leerDatosBusqueda = e => {
        guardarBusqueda(e.target.value);
    }


    //disminuye la cantidad del producto
    const restarProductos = index => {
        //copiar el arreglo original
        const todosProductos = [...productos];

        //validar si esta en 0, no puede restarse mas
        if (todosProductos[index].cantidad === 0) return;

        //decremento
        todosProductos[index].cantidad--;

        //almacenarlo en el state
        guardarProductos(todosProductos);
    }


    //aumenta la cantidad del producto
    const aumentarProductos = index => {
        //copiar el arreglo para no mutar el original
        const todosProductos=[...productos];

        //incremento
        todosProductos[index].cantidad++;

        //almacenarlo en el state
        guardarProductos(todosProductos);

    }




    //actualizar el total
    const actualizarTotal = () => {
        //si el arreglo de productos es igual a 0, el total es cero
        if(productos.length === 0){
            guardarTotal(0);
            return;
        }

        //calcular el nuevo total
        let nuevoTotal = 0;

        //recorrer todos los productos, sus cantidades y precios
        productos.map(obj => nuevoTotal+= obj.cantidad * obj.precio);

        //almacenar el total
        guardarTotal(nuevoTotal);
    }





    //Eliminar un producto del state
    const eliminarProductoPedido = id => {
        //compara que no se encuentre para mantener el resto menos el encontrado
        const todosProductos = productos.filter(obj => obj.producto !== id)
        guardarProductos(todosProductos);
    }



    //Realizar pedido
    const realizarPedido = async e => {
        e.preventDefault();

        //extraer el id
        const {idCliente} = props.match.params;


        //construir el objeto
        const pedido = {
            "cliente": idCliente,
            "pedido": productos,
            "total": total
        }

        //almacenarlo en la base de datos
        const resultado = await clienteAxios.post(`/pedidos/nuevo/${idCliente}`, pedido);

        //leer resultado
        if(resultado.status === 200){
            //alerta de todo bien
            Swal.fire({
                    type: 'success',
                    title: 'Correcto',
                    text: resultado.data.mensaje
                }
            );
        }
        else{
            //alerta de falla
            Swal.fire({
                type: 'error',
                title: 'Ha ocurrido un error',
                text: 'Intenta mas tarde'
            });
        }

        //redirecionar
        props.history.push('/pedidos');
    }






    return(
        <Fragment>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>Nombre: {cliente.nombre} {cliente.apellido}</p>
                <p>Telefono: {cliente.telefono}</p>
            </div>

            <FormBuscarProducto
                buscarProducto={buscarProducto}
                leerDatosBusqueda={leerDatosBusqueda}
            />

                <ul className="resumen">
                    {productos.map((obj, index) => (
                        <FormCantidadProducto
                            key={obj.producto}
                            obj={obj}
                            restarProductos={restarProductos}
                            aumentarProductos={aumentarProductos}
                            index={index}
                            eliminarProductoPedido={eliminarProductoPedido}
                        />
                        ))}
                </ul>

                <p className="total">Total a Pagar: <span>$ {total}</span></p>

            {total > 0 ? (
                <form onSubmit={realizarPedido}>
                    <input type="submit" className="btn btn-verde btn-block" value="Realizar Pedido"/>
                </form>
            ) : null}



        </Fragment>
    )

}

export default withRouter(NuevoPedido);