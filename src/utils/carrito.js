// 1. Validar que la cantidad deseada no supere el stock disponible (Prueba 3)
export const validarStock = (cantidadDeseada, stockDisponible) => {
  if (cantidadDeseada > stockDisponible) {
    return false;
  }
  return cantidadDeseada > 0;
};

// 2. Calcular el subtotal sumando precio * cantidad de todas las líneas (Prueba 1)
export const calcularSubtotal = (items = []) => {
  return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
};

// 3. Agregar o incrementar un producto en el carrito respetando stock (Prueba 2)
export const agregarAlCarrito = (carritoActual = [], productoNuevo, cantidadDeseada = 1) => {
  const existe = carritoActual.find((item) => item.id === productoNuevo.id);

  if (existe) {
    const nuevaCantidad = existe.cantidad + cantidadDeseada;
    
    // Si la nueva cantidad supera el stock, mantiene el carrito sin cambios
    if (!validarStock(nuevaCantidad, productoNuevo.stock)) {
      return carritoActual;
    }

    return carritoActual.map((item) =>
      item.id === productoNuevo.id
        ? { ...item, cantidad: nuevaCantidad }
        : item
    );
  }

  // Si no existe, valida stock antes de agregar con la cantidad seleccionada
  if (validarStock(cantidadDeseada, productoNuevo.stock)) {
    return [...carritoActual, { ...productoNuevo, cantidad: cantidadDeseada }];
  }

  return carritoActual;
};

// 4. Actualizar cantidad de una línea específica
export const actualizarCantidadLinea = (carritoActual = [], idProducto, nuevaCantidad) => {
  return carritoActual.map((item) => {
    if (item.id === idProducto) {
      // Garantizar que la cantidad esté entre 1 y el stock máximo
      const cantidadValida = Math.max(1, Math.min(nuevaCantidad, item.stock));
      return { ...item, cantidad: cantidadValida };
    }
    return item;
  });
};

// 5. Quitar un producto del carrito
export const eliminarDelCarrito = (carritoActual = [], idProducto) => {
  return carritoActual.filter((item) => item.id !== idProducto);
};

// 6. Aplicar cupón de descuento por porcentaje (Prueba 4)
export const aplicarCupon = (codigo, subtotal) => {
  const cuponNormalizado = codigo ? codigo.trim().toUpperCase() : '';

  if (cuponNormalizado === 'GAMER10') {
    const descuento = (subtotal * 10) / 100;
    return {
      descuento,
      porcentaje: 10,
      valido: true,
      mensaje: '¡Cupón del 10% aplicado con éxito!'
    };
  }

  return {
    descuento: 0,
    porcentaje: 0,
    valido: false,
    mensaje: 'Cupón inválido o vencido'
  };
};

// 7. Calcular el total final asegurando que nunca sea menor a 0 (Prueba 6)
export const calcularTotal = (subtotal, descuento = 0, costoEnvio = 0) => {
  const total = subtotal - descuento + costoEnvio;
  return total < 0 ? 0 : total;
};