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
              formatoPrecio={formatearCLP}
            />
          </div>
        </form>
      </main>
    </Layout>
  );
}