import React from "react";

function FormCantidadProducto(props) {

    const {obj, aumentarProductos, restarProductos, index, eliminarProductoPedido} = props;


    return (
        <li>
            <div className="texto-producto">
                <p className="nombre">{obj.nombre}</p>
                <p className="precio">$ {obj.precio}</p>
            </div>
            <div className="acciones">
                <div className="contenedor-cantidad">
                    <i className="fas fa-minus" onClick={() => restarProductos(index)}>
                    </i>

                    <p>{obj.cantidad}</p>

                    <i className="fas fa-plus" onClick={() => aumentarProductos(index)}>
                    </i>
                </div>
                <button type="button" className="btn btn-rojo" onClick={() => eliminarProductoPedido(obj.producto)}>
                    <i className="fas fa-minus-circle"></i>
                    Eliminar Producto
                </button>
            </div>
        </li>
    )
}

export default FormCantidadProducto;