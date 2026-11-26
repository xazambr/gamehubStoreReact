import { solicitar } from './api';

export const operacionService = {
  // Promociones (Admin)
  listarPromociones: () => solicitar('/promociones'),
  crearPromocion: (promo) =>
    solicitar('/promociones', {
      method: 'POST',
      body: JSON.stringify(promo),
    }),

  // Órdenes, Pagos, Inventario y Despachos (Operador)
  listarOrdenes: () => solicitar('/ordenes'),
  actualizarEstadoOrden: (id, estado) =>
    solicitar(`/ordenes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    }),
  listarPagos: () => solicitar('/pagos'),
  actualizarPago: (id, datos) =>
    solicitar(`/pagos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
  listarInventario: () => solicitar('/inventario'),
  ajustarStock: (id, datos) =>
    solicitar(`/inventario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
  listarEnvios: () => solicitar('/envios'),
  crearEnvio: (envio) =>
    solicitar('/envios', {
      method: 'POST',
      body: JSON.stringify(envio),
    }),
  actualizarEnvio: (id, envio) =>
    solicitar(`/envios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(envio),
    }),
};