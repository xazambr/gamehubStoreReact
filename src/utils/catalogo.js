// Obtener opciones únicas para selectores de filtro
export const obtenerCategoriasUnicas = (productos = []) => {
  return [...new Set(productos.map(p => p.categoria).filter(Boolean))];
};

export const obtenerMarcasUnicas = (productos = []) => {
  return [...new Set(productos.map(p => p.marca).filter(Boolean))];
};

// Validar que el precio mínimo no supere al máximo
export const validarRangoPrecios = (min, max) => {
  const minNum = parseFloat(min);
  const maxNum = parseFloat(max);
  return !isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum;
};

// Calcular precio considerando descuento opcional
export const obtenerPrecioEfectivo = (producto) => {
  if (!producto) return 0;
  const precio = Number(producto.precio) || 0;
  const descuento = Number(producto.descuento) || 0;
  return descuento > 0 ? precio * (1 - descuento / 100) : precio;
};

// Filtrar y ordenar la lista de productos
export const filtrarYOrdenarProductos = (productos = [], filtros = {}, orden = 'nombre-asc') => {
  const minNum = parseFloat(filtros.precioMin);
  const maxNum = parseFloat(filtros.precioMax);

  // Si el rango es erróneo, retorna array vacío
  if (validarRangoPrecios(filtros.precioMin, filtros.precioMax)) {
    return [];
  }

  let resultado = [...productos];

  if (filtros.categoria) {
    resultado = resultado.filter(p => p.categoria === filtros.categoria);
  }

  if (filtros.marca) {
    resultado = resultado.filter(p => p.marca === filtros.marca);
  }

  if (filtros.soloStock) {
    resultado = resultado.filter(p => p.stock > 0);
  }

  if (!isNaN(minNum)) {
    resultado = resultado.filter(p => obtenerPrecioEfectivo(p) >= minNum);
  }

  if (!isNaN(maxNum)) {
    resultado = resultado.filter(p => obtenerPrecioEfectivo(p) <= maxNum);
  }

  // Ordenamiento
  switch (orden) {
    case 'precio-asc':
      resultado.sort((a, b) => obtenerPrecioEfectivo(a) - obtenerPrecioEfectivo(b));
      break;
    case 'precio-desc':
      resultado.sort((a, b) => obtenerPrecioEfectivo(b) - obtenerPrecioEfectivo(a));
      break;
    case 'nombre-desc':
      resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
      break;
    default:
      resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  return resultado;
};