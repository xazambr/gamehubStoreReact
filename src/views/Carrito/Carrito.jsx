import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiArrowRight, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";
import { useState } from "react";
import { useCarrito } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Carrito() {
  const formatearMoneda = (valor) => `$${valor.toLocaleString('es-CL')}`;

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

  // Calculo de precio final
  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const montoDescuento = (subtotal * descuentoPorcentaje) / 100;
  const total = Math.max(0, subtotal - montoDescuento);


  const handleAplicarCupon = (e) => {
    e.preventDefault();
    if (cuponInput.trim().toUpperCase() === 'GAMER10') {
      setDescuentoPorcentaje(10);
      setMensajeCupon({ tipo: 'exito', texto: '¡Cupón de 10% aplicado!' });
    } else {
      setDescuentoPorcentaje(0);
      setMensajeCupon({ tipo: 'error', texto: 'Cupón inválido o vencido' });
    }
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
      <div className="seccionCarrito">
        <div className="container">
          <p className="subtitulo">TU SELECCIÓN</p>
          <h2 className="titulo">CARRITO DE COMPRAS</h2>

          {/* Lista de lineas de productos por ahora, reemplazar con un componente mas adelante */}
          <div className="col-12 col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-secondary">{carrito.length} producto{carrito.length > 1 ? 's' : ''}</span>
              <button className="btnVaciar" onClick={vaciarCarrito}>
                <FiTrash2 /> Vaciar carrito
              </button>
            </div>

            {carrito.map((item) => (
              <div key={item.id} className="tarjetaLinea">
                <div className="row align-items-center g-3">

                  {/* Imagen del producto */}
                  <div className="col-auto">
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="imagenProducto"
                    />
                  </div>

                  {/* Nombre, marca y botón quitar */}
                  <div className="col">
                    <span className="marcaText">{item.marca || 'AMD'}</span>
                    <h5 className="nombreProducto">{item.nombre}</h5>
                    <button
                      className="btnQuitar"
                      onClick={() => eliminarProducto(item.id)}
                    >
                      <FiTrash2 /> Quitar
                    </button>
                  </div>

                  {/* Controles de cantidad (+ / -) */}
                  <div className="col-auto text-end ms-auto ms-md-0">
                    <div className="controlCantidad">
                      <button
                        className="btnCantidad"
                        onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                        disabled={item.cantidad <= 1}
                      >
                        <FiMinus />
                      </button>

                      <span className="numeroCantidad">{item.cantidad}</span>

                      <button
                        className="btnCantidad"
                        onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.stock} // Validación de Stock
                      >
                        <FiPlus />
                      </button>
                    </div>

                    {/* Subtotal de la línea */}
                    <div className="mt-2">
                      <div className="precioTotalLinea">
                        {formatearMoneda(item.precio * item.cantidad)}
                      </div>
                      <div className="precioUnitarioText">
                        {formatearMoneda(item.precio)} c/u
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}

          {/* Resumen de productos */}
          <div className="col-12 col-lg-4">
            <div className="panelResumen">
              <h4 className="fw-bold mb-3">RESUMEN</h4>

              {/* Formulario de Cupón */}
              <div className="mb-4">
                <label className="form-label text-secondary small">Código de cupón</label>
                <form onSubmit={handleAplicarCupon} className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control inputCupon"
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

              {/* Seccion total */}
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Subtotal</span>
                <span className="fw-bold">{formatearMoneda(subtotal)}</span>
              </div>

              {descuentoPorcentaje > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Descuento ({descuentoPorcentaje}%)</span>
                  <span>-{formatearMoneda(montoDescuento)}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-4">
                <span className="text-secondary">Envío</span>
                <span className="text-success fw-bold">Gratis</span>
              </div>

              <hr className="border-secondary my-3" />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="fw-bold fs-5">Total</span>
                <span className="montoTotal">{formatearMoneda(total)}</span>
              </div>

              {/* Botón Checkout */}
              <button
                className="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 fw-bold"
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
    </Layout >
  );
}
