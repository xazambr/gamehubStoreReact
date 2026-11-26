<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import FormularioDespacho from '../../components/Checkout/FormularioDespacho.jsx';
import MetodoPago from '../../components/Checkout/MetodoPago.jsx';
import ResumenOrden from '../../components/Checkout/ResumenOrden.jsx';
import ConfirmacionCompra from '../../components/Checkout/ConfirmacionCompra.jsx';
import { useCarrito } from '../../context/CartContext';
import { useAuth } from '../../auth/useAuth';
import { checkoutService } from '../../services/checkoutService';
import { formatearCLP } from '../../utils/utils';
import './Checkout.css'

export default function Checkout() {
  const { carrito, subtotal, vaciarCarrito } = useCarrito();
  const { usuario } = useAuth();

  const [formulario, setFormulario] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    region: '',
    comuna: '',
    direccion: '',
    metodoPago: 'tarjeta',
  });

  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [ordenConfirmada, setOrdenConfirmada] = useState(null);

  // Precarga nombre y correo si el usuario está autenticado
  useEffect(() => {
    if (usuario) {
      setFormulario((prev) => ({
        ...prev,
        nombre: prev.nombre || usuario.nombre || usuario.username || '',
        correo: prev.correo || usuario.email || '',
      }));
    }
  }, [usuario]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formulario.nombre.trim()) nuevosErrores.nombre = 'Ingresa tu nombre completo.';
    if (!formulario.correo.trim() || !formulario.correo.includes('@')) {
      nuevosErrores.correo = 'Ingresa un correo electrónico válido.';
    }
    if (!formulario.telefono.trim()) nuevosErrores.telefono = 'Ingresa un teléfono de contacto.';
    if (!formulario.region) nuevosErrores.region = 'Selecciona una región.';
    if (!formulario.comuna.trim()) nuevosErrores.comuna = 'Ingresa tu comuna.';
    if (!formulario.direccion.trim()) nuevosErrores.direccion = 'Ingresa tu dirección de despacho.';
    if (!formulario.metodoPago) nuevosErrores.metodoPago = 'Selecciona un método de pago.';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleConfirmarCompra = async (e) => {
    if (e) e.preventDefault();
    setErrorGeneral(null);

    if (procesando || carrito.length === 0) return;
    if (!validarFormulario()) return;

    setProcesando(true);
    try {
      const direccionCompleta = `${formulario.direccion.trim()}, ${formulario.comuna.trim()}, ${formulario.region} (Tel: ${formulario.telefono.trim()})`;
      const metodoPagoBackend =
        formulario.metodoPago === 'tarjeta' ? 'TARJETA_CREDITO' : 'TRANSFERENCIA';

      // 1. Reserva stock en msvc-inventory, crea orden en msvc-orders y pago en msvc-payments
      const ordenCreada = await checkoutService.procesarCompra({
        usuario,
        carrito,
        direccionEnvio: direccionCompleta,
        metodoPago: metodoPagoBackend,
        subtotal,
        descuento: 0,
        costoEnvio: 0,
        total: subtotal,
        cupon: null,
      });

      const ordenId = ordenCreada?.id ?? ordenCreada?.ordenId ?? Date.now();

      // 2. Arma el objeto exacto que espera ConfirmacionCompra.jsx
      setOrdenConfirmada({
        numero: `#${ordenId}`,
        total: subtotal,
        estadoPago: 'PENDIENTE DE VALIDACIÓN',
        cliente: {
          nombre: formulario.nombre.trim(),
          correo: formulario.correo.trim(),
          telefono: formulario.telefono.trim(),
          region: formulario.region,
          comuna: formulario.comuna.trim(),
          direccion: formulario.direccion.trim(),
          metodoPago: formulario.metodoPago,
        },
      });

      vaciarCarrito();
    } catch (err) {
      setErrorGeneral(err.message || 'No se pudo procesar la compra. Intenta nuevamente.');
    } finally {
      setProcesando(false);
    }
  };

  // Si ya se completó la compra, muestra directamente ConfirmacionCompra.jsx
  if (ordenConfirmada) {
    return (
      <Layout>
        <ConfirmacionCompra orden={ordenConfirmada} formatoPrecio={formatearCLP} />
=======
import Layout from "../../components/Layout";
import { useState } from "react";
import { useCarrito } from "../../context/CartContext";

import FormularioDespacho from "../../components/Checkout/FormularioDespacho";
import MetodoPago from "../../components/Checkout/MetodoPago";
import ResumenOrden from "../../components/Checkout/ResumenOrden";
import ConfirmacionCompra from "../../components/Checkout/ConfirmacionCompra";

import { formatearCLP } from "../../utils/utils";
import { 
  validarFormulario, 
  crearEstructuraOrden, 
  guardarOrdenEnLocalStorage 
} from "../../utils/validaciones";

import "./Checkout.css";

const formularioInicial = {
  nombre: "",
  correo: "",
  telefono: "",
  region: "",
  comuna: "",
  direccion: "",
  metodoPago: "tarjeta",
};

export default function Checkout() {
  const { carrito, vaciarCarrito } = useCarrito();

  const [formulario, setFormulario] = useState(formularioInicial);
  const [errores, setErrores] = useState({});
  const [orden, setOrden] = useState(null);

  const total = carrito.reduce(
    (suma, producto) =>
      suma + Number(producto.precio) * Number(producto.cantidad),
    0
  );

  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));

    setErrores((actuales) => ({
      ...actuales,
      [name]: "",
    }));
  };

  const manejarCompra = (e) => {
    e.preventDefault();

    if (carrito.length === 0) {
      setErrores({
        carrito: "No puedes comprar con el carrito vacío.",
      });
      return;
    }
    const { esValido, errores: nuevosErrores } = validarFormulario(formulario);

    if (!esValido) {
      setErrores(nuevosErrores);
      return;
    }

    const nuevaOrden = crearEstructuraOrden(formulario, carrito, total);
    guardarOrdenEnLocalStorage(nuevaOrden);

    setOrden(nuevaOrden);
    vaciarCarrito();
  };

  if (orden) {
    return (
      <ConfirmacionCompra
        orden={orden}
        formatoPrecio={formatearCLP}
      />
    );
  }

  if (carrito.length === 0) {
    return (
      <Layout>
        <main className="checkout-container">
          <section className="checkout-panel checkout-vacio">
            <h1>Tu carrito está vacío</h1>
            <p>Agrega productos antes de finalizar tu compra.</p>
            <a href="/catalogo" className="checkout-boton checkout-enlace">
              Ir al catálogo
            </a>
          </section>
        </main>
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
      </Layout>
    );
  }

  return (
    <Layout>
<<<<<<< HEAD
      <main className="container-xl py-5 text-light">
        <h1 className="fs-3 mb-4">Finalizar Compra</h1>

        {errorGeneral && <div className="alert alert-danger">{errorGeneral}</div>}

        {carrito.length === 0 ? (
          <div className="checkout-panel text-center py-5">
            <p className="mb-3">Tu carrito está vacío.</p>
            <Link to="/catalogo" className="checkout-boton checkout-enlace">
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <form onSubmit={handleConfirmarCompra} className="row g-4" noValidate>
            <div className="col-lg-7 d-flex flex-column gap-4">
=======
      <main className="checkout-container">
        <header className="checkout-encabezado">
          <p className="checkout-etiqueta">GAMEHUB STORE / CHECKOUT</p>
          <h2>Finalizar compra</h2>
          <p>Ya casi tienes tu próximo nivel de juego.</p>
        </header>

        <form onSubmit={manejarCompra} noValidate>
          {errores.carrito && (
            <p className="checkout-error" role="alert">
              {errores.carrito}
            </p>
          )}

          <div className="checkout-grid">
            <div className="checkout-formulario">
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
              <FormularioDespacho
                formulario={formulario}
                errores={errores}
                manejarCambio={manejarCambio}
              />
<<<<<<< HEAD
=======

>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
              <MetodoPago
                metodoPago={formulario.metodoPago}
                manejarCambio={manejarCambio}
                error={errores.metodoPago}
              />
            </div>

<<<<<<< HEAD
            <div className="col-lg-5">
              <ResumenOrden
                carrito={carrito}
                total={subtotal}
                formatoPrecio={formatearCLP}
                onConfirmar={handleConfirmarCompra}
              />
              {procesando && (
                <p className="text-info small mt-2 text-center">
                  Reservando stock y generando tu orden...
                </p>
              )}
            </div>
          </form>
        )}
=======
            <ResumenOrden
              carrito={carrito}
              total={total}
              formatoPrecio={formatearCLP}
            />
          </div>
        </form>
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
      </main>
    </Layout>
  );
}