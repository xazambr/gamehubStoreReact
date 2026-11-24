import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiArrowRight, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useState } from "react";
import { useCarrito } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import TarjetaCarrito from "../../components/TarjetaCarrito/TarjetaCarrito.jsx"
import './Carrito.css'

import { formatearCLP } from "../../utils/utils.js";
import {
  calcularSubtotal,
  aplicarCupon,
  calcularTotal
} from "../../utils/carrito";

export default function Carrito() {

  const {
    carrito,
    eliminarProducto,
    vaciarCarrito,
    actualizarCantidad
  } = useCarrito();

  const navigate = useNavigate();

  // Estados para el cupón de descuento
  const [cuponInput, setCuponInput] = useState('');
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0);
  const [mensajeCupon, setMensajeCupon] = useState({ tipo: '', texto: '' });

  const subtotal = calcularSubtotal(carrito);
  const montoDescuento = Math.round((subtotal * descuentoPorcentaje) / 100);
  const total = calcularTotal(subtotal, montoDescuento);

  const handleAplicarCupon = (e) => {
    e.preventDefault();
    const resultado = aplicarCupon(cuponInput);
    setDescuentoPorcentaje(resultado.descuentoPorcentaje);
    setMensajeCupon(resultado.mensaje);
  };

  {/* carrito vacio */ }
  if (carrito.length === 0) {
    return (
      <Layout>
        <div className="seccionCarrito">
          <div className="container">
            <p className="subtitulo">TU SELECCIÓN</p>
            <h1 className="titulo">CARRITO DE COMPRAS</h1>

            <div className="contenedorVacio">
              <div className="iconoVacioCirculo">
                <FiShoppingCart />
              </div>
              <h3 className="fw-bold mb-2">Tu carrito está vacío</h3>
              <p className="text-secondary mb-4">Agrega productos del catálogo para comenzar.</p>
              <Link to="/catalogo" className="btn btn-primary px-4 py-2">
                Explorar catálogo
              </Link>
            </div>
          </div>
        </div>
      </Layout>

    );
  }

  return (
    <Layout>
      <div className="seccionCarrito py-5">
        <div className="container">

          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <p className="subtitulo">TU SELECCIÓN</p>
              <h1 className="titulo">CARRITO DE COMPRAS</h1>
              <span className="text-secondary small">
                {carrito.length} {carrito.length === 1 ? 'producto' : 'productos'} en tu lista
              </span>
            </div>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
              onClick={vaciarCarrito}
            >
              <FiTrash2 size={13} /> Vaciar carrito
            </button>
          </div>

          <div className="row g-4">
            {/* Lista de productos */}
            <div className="col-12 col-lg-8">
              {carrito.map((producto) => (
                <TarjetaCarrito
                  key={producto.id}
                  item={producto}
                  onActualizarCantidad={actualizarCantidad}
                  onEliminar={eliminarProducto}
                  formatearMoneda={formatearCLP}
                />
              ))}
            </div>

            {/* Panel de Resumen lateral */}
            <div className="col-12 col-lg-4">
              <div className="panelResumen">
                <h4 className="fw-bold mb-3 text-light">RESUMEN</h4>

                {/* Formulario de Cupón */}
                <div className="mb-4">
                  <label className="form-label text-secondary small">Código de cupón</label>
                  <form onSubmit={handleAplicarCupon} className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm inputCupon"
                      placeholder="Ej: GAMER10"
                      value={cuponInput}
                      onChange={(e) => setCuponInput(e.target.value)}
                    />
                    <button type="submit" className="btnAplicar">
                      Aplicar
                    </button>
                  </form>
                  {mensajeCupon.texto && (
                    <div className={`small mt-2 ${mensajeCupon.tipo === 'exito' ? 'text-success' : 'text-danger'}`}>
                      {mensajeCupon.texto}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Subtotal</span>
                  <span className="fw-bold">{formatearCLP(subtotal)}</span>
                </div>

                {descuentoPorcentaje > 0 && (
                  <div className="d-flex justify-content-between mb-2 text-success">
                    <span>Descuento ({descuentoPorcentaje}%)</span>
                    <span>-{formatearCLP(montoDescuento)}</span>
                  </div>
                )}

                <div className="d-flex justify-content-between mb-3">
                  <span className="text-secondary">Envío</span>
                  <span className="text-success fw-bold">Gratis</span>
                </div>

                <hr className="border-secondary my-3" />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold fs-5">Total</span>
                  <span className="montoTotal">{formatearCLP(total)}</span>
                </div>

                <button
                  type="button"
                  className="btnCheckout"
                  onClick={() => navigate('/checkout')}
                >
                  Proceder al checkout <FiArrowRight />
                </button>

                <div className="text-center mt-3">
                  <Link to="/catalogo" className="text-info text-decoration-none small fw-bold">
                    Seguir comprando
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}