import { createContext, useContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import { useAuth } from '../auth/useAuth';
=======
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
import {
  agregarAlCarrito as agregarHelper,
  actualizarCantidadLinea,
  eliminarDelCarrito as eliminarHelper,
  calcularSubtotal,
  calcularTotal
} from '../utils/carrito';

const CartContext = createContext();

export function CartProvider({ children }) {
<<<<<<< HEAD
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
=======
  const [carrito, setCarrito] = useState(() => {
    try {
      const saved = localStorage.getItem('gamehub_carrito');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error al leer el carrito de localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gamehub_carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarProducto = (producto, cantidad = 1) => {
    setCarrito((prev) => agregarHelper(prev, producto, cantidad));
  };

  const actualizarCantidad = (id, nuevaCantidad) => {
    setCarrito((prev) => actualizarCantidadLinea(prev, id, nuevaCantidad));
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) => eliminarHelper(prev, id));
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
  };

  const vaciarCarrito = () => {
    setCarrito([]);
<<<<<<< HEAD
    localStorage.removeItem(claveStorage);
=======
    localStorage.removeItem('gamehub_carrito');
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
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