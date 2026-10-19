import { createContext, useContext, useState, useEffect } from 'react';
import {
  agregarAlCarrito as agregarHelper,
  actualizarCantidadLinea,
  eliminarDelCarrito as eliminarHelper,
  calcularSubtotal,
  calcularTotal
} from '../utils/carrito';

const CartContext = createContext();

export function CartProvider({ children }) {
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
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('gamehub_carrito');
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