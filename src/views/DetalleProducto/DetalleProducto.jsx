import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { PRODUCTOS } from '../../data/productos';
import { useCarrito } from '../../context/CartContext';
import Layout from '../../components/Layout';

import {formatearCLP} from "../../utils/utils"

export function DetalleProducto() {
  // 1. Obtener el ID dinámico enviado por la URL
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();

  // 2. Buscar el producto por ID (convertir el parámetro de URL a número)
  const producto = PRODUCTOS.find((item) => item.id === Number(id));

  // Si el ID no existe en tu archivo productos.js
  if (!producto) {
    return (
      <div className="container py-5 text-center text-light">
        <h2>Producto no encontrado</h2>
        <p className="text-secondary">El producto que buscas no existe o fue retirado.</p>
        <Link to="/catalogo" className="btn btn-primary mt-3">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const sinStock = !producto.stock || producto.stock <= 0;

  return (
    <Layout>
      <div className="container py-5 text-light">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-link text-info text-decoration-none p-0 mb-4 d-inline-flex align-items-center gap-1"
        >
          <FiArrowLeft /> Volver atrás
        </button>

        <div className="row g-4 align-items-center">
          {/* Imagen del producto */}
          <div className="col-12 col-md-6">
            <div className="bg-dark p-4 rounded-3 text-center">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="img-fluid rounded"
                style={{ maxHeight: '350px', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Información del producto */}
          <div className="col-12 col-md-6">
            <span className="text-info text-uppercase fw-bold small">{producto.marca}</span>
            <h1 className="fw-bold my-2">{producto.nombre}</h1>
            <p className="text-secondary mb-4">{producto.descripcion}</p>

            <div className="mb-3">
              {sinStock ? (
                <span className="badge bg-danger bg-opacity-20 text-danger border border-danger px-3 py-2">
                  <FiAlertCircle /> Sin Stock disponible
                </span>
              ) : (
                <span className="badge bg-info bg-opacity-10 text-info border border-info px-3 py-2">
                  <FiCheckCircle /> Stock disponible: {producto.stock} unidades
                </span>
              )}
            </div>

            <div className="fs-2 fw-bold text-light mb-4">
              {formatearCLP(producto.precio)}
            </div>

            <button
              type="button"
              className="btn btn-primary btn-lg w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={sinStock}
              onClick={() => agregarProducto(producto)}
            >
              <FiShoppingCart />
              {sinStock ? 'Producto Agotado' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}