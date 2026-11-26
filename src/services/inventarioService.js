import { solicitar } from './api';

export const inventarioService = {
<<<<<<< HEAD
  // Listado completo
  listar: (opciones) => solicitar('/inventario', opciones),

  // Consulta directa por productoId usando el endpoint específico
  obtenerPorProducto: (productoId, opciones) =>
    solicitar(`/inventario/producto/${productoId}`, opciones),

  // Bitácora de movimientos de un producto
  obtenerMovimientos: (productoId, opciones) =>
    solicitar(`/inventario/movimientos/${productoId}`, opciones),

  // Crear registro inicial (cumple con las 5 validaciones @NotNull / @NotBlank de Inventario.java)
  crear: ({ productoId, stockDisponible, stockReservado = 0, stockMinimo = 5, ubicacion = 'Bodega Central' }) =>
    solicitar('/inventario', {
      method: 'POST',
      body: JSON.stringify({
        productoId: Number(productoId),
        stockDisponible: Number(stockDisponible),
        stockReservado: Number(stockReservado),
        stockMinimo: Number(stockMinimo),
        ubicacion: ubicacion.trim() || 'Bodega Central',
      }),
    }),

  // Actualizar registro completo (envía todos los campos obligatorios para evitar error 400)
  actualizar: (id, registroActual, cambios) =>
    solicitar(`/inventario/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        productoId: Number(registroActual.productoId),
        stockDisponible: Number(cambios.stockDisponible ?? registroActual.stockDisponible),
        stockReservado: Number(cambios.stockReservado ?? registroActual.stockReservado ?? 0),
        stockMinimo: Number(cambios.stockMinimo ?? registroActual.stockMinimo ?? 5),
        ubicacion: (cambios.ubicacion ?? registroActual.ubicacion ?? 'Bodega Central').trim(),
      }),
    }),

  // Flujo de reservas del backend
  reservar: (productoId, cantidad) =>
    solicitar(`/inventario/reservas/${productoId}/reservar?cantidad=${Number(cantidad)}`, {
      method: 'POST',
    }),

  liberar: (productoId, cantidad) =>
    solicitar(`/inventario/reservas/${productoId}/liberar?cantidad=${Number(cantidad)}`, {
      method: 'POST',
    }),

  confirmarSalida: (productoId, cantidad) =>
    solicitar(`/inventario/reservas/${productoId}/confirmar?cantidad=${Number(cantidad)}`, {
      method: 'POST',
=======
  listar: () => solicitar('/inventario'),
  obtenerPorProducto: (productoId) => solicitar(`/inventario/producto/${productoId}`),
  ajustarStock: (id, datos) =>
    solicitar(`/inventario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
    }),
};