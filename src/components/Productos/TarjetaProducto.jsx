import { Link } from 'react-router-dom';
import { FiShoppingCart, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useCarrito } from '../../context/CartContext';
import './TarjetaProducto.css';

export default function TarjetaProducto({producto}) {
    const { agregarProducto } = useCarrito();

    const sinStock = !producto.stock || producto.stock <= 0;
    const formatearPrecio = (valor) => `$${valor.toLocaleString('es-CL')}`;

    return (
        <div className='card h-100 cardGamer'>

            <div className='contenedorImagen'>
                <span className='badgeMarca'>{producto.marca}</span>

                <Link to={`/producto/${producto.id}`}>
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className='imagenProducto'
                        onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200/1E1730/00D2FF?text=GameHub";
                        }}
                    />
                </Link>
            </div>

            {/* Cuerpo Tarjeta */}
            <div className="card-body d-flex flex-column p-3">

                {/* Indicador de stock */}
                <div className="mb-2">
                    {sinStock ? (
                        <span className='badgeSinStock'>
                            <FiAlertCircle /> Sin Stock
                        </span>
                    ) : (
                        <span className='badgeStock'>
                            <FiCheckCircle /> Stock: {producto.stock}
                        </span>
                    )}
                </div>

                <Link to={`/producto/${producto.id}`} className="text-decoration-none">
                    <h5 className='tituloProducto' title={producto.nombre}>
                        {producto.nombre}
                    </h5>
                </Link>

                <p className='descripcionProducto'>
                    {producto.descripcion}
                </p>

                <div className="mt-auto pt-2">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="text-secondary small fw-bold">PRECIO</span>
                        <span className='precioAcento'>
                            {formatearPrecio(producto.precio)}
                        </span>
                    </div>

                    <button
                        type="button"
                        className='w-100 btnAgregar'
                        disabled={sinStock}
                        onClick={() => agregarProducto(producto)}
                    >
                        <FiShoppingCart />
                        {sinStock ? 'Agotado' : 'Agregar al carrito'}
                    </button>
                </div>

            </div>
        </div>
    );
}