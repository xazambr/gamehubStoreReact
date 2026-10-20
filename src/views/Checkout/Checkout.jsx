import Layout from "../../components/Layout";
import { useState } from "react";
import { useCarrito } from "../../context/CartContext";

import FormularioDespacho from "../../components/Checkout/FormularioDespacho";
import MetodoPago from "../../components/Checkout/MetodoPago";
import ResumenOrden from "../../components/Checkout/ResumenOrden";
import ConfirmacionCompra from "../../components/Checkout/ConfirmacionCompra";

import "./checkout.css";

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

  const formatoPrecio = (valor) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    }).format(valor);

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

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "Ingresa tu nombre completo.";
    }

    if (!formulario.correo.trim()) {
      nuevosErrores.correo = "Ingresa tu correo.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo.trim())
    ) {
      nuevosErrores.correo = "Ingresa un correo válido.";
    }

    const telefono = formulario.telefono.replace(/[\s()-]/g, "");

    if (!telefono) {
      nuevosErrores.telefono = "Ingresa tu teléfono.";
    } else if (!/^(?:\+?56)?9\d{8}$/.test(telefono)) {
      nuevosErrores.telefono = "Ingresa un celular chileno válido.";
    }

    if (!formulario.region) {
      nuevosErrores.region = "Selecciona una región.";
    }

    if (!formulario.comuna.trim()) {
      nuevosErrores.comuna = "Ingresa tu comuna.";
    }

    if (!formulario.direccion.trim()) {
      nuevosErrores.direccion = "Ingresa tu dirección.";
    }

    if (!formulario.metodoPago) {
      nuevosErrores.metodoPago = "Selecciona un método de pago.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarCompra = (e) => {
    e.preventDefault();

    if (carrito.length === 0) {
      setErrores({
        carrito: "No puedes comprar con el carrito vacío.",
      });
      return;
    }

    if (!validarFormulario()) return;

    const nuevaOrden = {
      numero: `GH-${Date.now().toString().slice(-8)}`,
      fecha: new Date().toLocaleDateString("es-CL"),
      cliente: { ...formulario },
      productos: carrito.map((producto) => ({ ...producto })),
      total,
      estadoPago: "Aprobado (simulado)",
    };

    try {
      const ordenesGuardadas = JSON.parse(localStorage.getItem('gamehub_ordenes')) || [];
      localStorage.setItem('gamehub_ordenes', JSON.stringify([nuevaOrden, ...ordenesGuardadas]));
    } catch (err) {
      console.error("Error al guardar la orden en localStorage:", err);
    }

    setOrden(nuevaOrden);
    vaciarCarrito();
  };

  if (orden) {
    return (
      <ConfirmacionCompra
        orden={orden}
        formatoPrecio={formatoPrecio}
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
      </Layout>

    );
  }

  return (
    <Layout>
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
              <FormularioDespacho
                formulario={formulario}
                errores={errores}
                manejarCambio={manejarCambio}
              />

              <MetodoPago
                metodoPago={formulario.metodoPago}
                manejarCambio={manejarCambio}
                error={errores.metodoPago}
              />
            </div>

            <ResumenOrden
              carrito={carrito}
              total={total}
              formatoPrecio={formatoPrecio}
            />
          </div>
        </form>
      </main>
    </Layout>
  );
}
