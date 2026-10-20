export const obtenerOrdenesGuardadas = () => {
  try {
    const ordenes = JSON.parse(localStorage.getItem('gamehub_ordenes'));
    return Array.isArray(ordenes) ? ordenes : [];
  } catch (error) {
    console.error("Error al leer órdenes desde localStorage:", error);
    return [];
  }
};