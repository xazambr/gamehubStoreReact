import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/useAuth';
import {
  agregarAlCarrito as agregarHelper,
  actualizarCantidadLinea,
  eliminarDelCarrito as eliminarHelper,
  calcularSubtotal,
  calcularTotal
} from '../utils/carrito';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { usuario, autenticado } = useAuth();

  // Clave dinámica: 'gamehub_carrito_invitado' sin sesión, o 'gamehub_carrito_<usuario>' al iniciar sesión
  const identificadorUsuario =
    autenticado && usuario
      ? (usuario.id ?? usuario.username ?? usuario.email)
      : 'invitado';

  const claveStorage = `gamehub_carrito_${identificadorUsuario}`;

  const [carrito, setCarrito] = useState([]);

  // 1. Cargar (y fusionar si viene de invitado) cada vez que cambia el usuario
  useEffect(() => {
    try {
      const guardadoUsuario = JSON.parse(localStorage.getItem(claveStorage) || '[]');

      if (autenticado && usuario) {
        const claveInvitado = 'gamehub_carrito_invitado';
        const guardadoInvitado = JSON.parse(localStorage.getItem(claveInvitado) || '[]');

        if (guardadoInvitado.length > 0) {
          // Reutiliza tu propio helper agregarAlCarrito para fusionar respetando el stock
          const carritoFusionado = guardadoInvitado.reduce(
            (acc, itemInv) => agregarHelper(acc, itemInv, itemInv.cantidad),
            guardadoUsuario
          );

          localStorage.setItem(claveStorage, JSON.stringify(carritoFusionado));
          localStorage.removeItem(claveInvitado);
          setCarrito(carritoFusionado);
          return;
        }
      }

      setCarrito(guardadoUsuario);
    } catch (error) {
      console.error('Error al leer el carrito de localStorage', error);
      setCarrito([]);
    }
  }, [claveStorage, autenticado, usuario]);

  // 2. Guardar siempre en la clave del usuario activo
  const actualizarYGuardar = (updater) => {
    setCarrito((prev) => {
      const siguiente = typeof updater === 'function' ? updater(prev) : updater;
      localStorage.setItem(claveStorage, JSON.stringify(siguiente));
      return siguiente;
    });
  };

  const agregarProducto = (producto, cantidad = 1) => {
    actualizarYGuardar((prev) => agregarHelper(prev, producto, cantidad));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    actualizarYGuardar((prev) => actualizarCantidadLinea(prev, id, nuevaCantidad));
  };

  const eliminarProducto = (id) => {
    actualizarYGuardar((prev) => eliminarHelper(prev, id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem(claveStorage);
  };

  const subtotal = calcularSubtotal(carrito);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        carrito,
        subtotal,
        totalItems,
        agregarProducto,
        actualizarCantidad,
        eliminarProducto,
        vaciarCarrito,
        calcularTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCarrito = () => useContext(CartContext);