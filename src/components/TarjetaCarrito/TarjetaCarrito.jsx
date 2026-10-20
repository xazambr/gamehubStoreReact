import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import "./TarjetaCarrito.css"

export default function TarjetaCarrito({ item }, onActualizarCantidad, onEliminar) {

    const formatearMoneda = (val) => `$${val.toLocaleString('es-CL')}`;

    const precioUnitario = Number(item?.precio) || 0;
    const cantidadItem = Number(item?.cantidad) || 1;
    const subtotalLinea = precioUnitario * cantidadItem;

    return (
        <div className="TarjetaLinea">
            <div className="row align-items-center g-3">

                {/* Imagen del producto */}
                <div className="col-auto">
                    <img
                        src={item?.imagen}
                        alt={item?.nombre}
                        className="imagenProducto"
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/110x85/1E1730/00D2FF?text=GameHub";
                        }}
                    />
                </div>

                {/* Marca, Nombre y Botón Eliminar */}
                <div className="col">
                    <span className="marcaText">{item?.marca}</span>
                    {/* Corregido: className="nombreProducto" */}
                    <h5 className="nombreProducto">{item?.nombre}</h5>

                    <button
                        type="button"
                        className="btnQuitar"
                        onClick={() => onEliminar(item?.id)}
                    >
                        <FiTrash2 /> Quitar
                    </button>
                </div>

                {/* Botones de incremento / decremento */}
                <div className="col-auto text-end">
                    <div className="controlCantidad">
                        <button
                            type="button"
                            className="btnCantidad"
                            onClick={() => onActualizarCantidad(item?.id, cantidadItem - 1)}
                            disabled={cantidadItem <= 1}
                            aria-label="Disminuir cantidad"
                        >
                            <FiMinus />
                        </button>

                        <span className="numeroCantidad">{cantidadItem}</span>

                        <button
                            type="button"
                            className="btnCantidad"
                            onClick={() => onActualizarCantidad(item?.id, cantidadItem + 1)}
                            disabled={cantidadItem >= (item?.stock || 10)}
                            aria-label="Aumentar cantidad"
                        >
                            <FiPlus />
                        </button>
                    </div>

                    {/* Subtotal y precio unitario formateados */}
                    <div className="mt-2">
                        <div className="precioSubtotal">
                            {formatearMoneda(subtotalLinea)}
                        </div>
                        <div className="precioUnitario">
                            {formatearMoneda(precioUnitario)} c/u
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}