import { solicitar } from './api';

function extraerLista(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  if (Array.isArray(respuesta?.content)) return respuesta.content;
  if (Array.isArray(respuesta?.data)) return respuesta.data;
  if (respuesta?._embedded) {
    const primeraClave = Object.keys(respuesta._embedded)[0];
    if (primeraClave && Array.isArray(respuesta._embedded[primeraClave])) {
      return respuesta._embedded[primeraClave];
    }
  }
  return [];
}

export const operacionService = {
  // Promociones (Admin)
  listarPromociones: () => solicitar('/promociones'),
  crearPromocion: (promo) =>
    solicitar('/promociones', {
      method: 'POST',
      body: JSON.stringify(promo),
    }),

  // Órdenes, Pagos, Inventario y Despachos (Operador)
 // ÓRDENES (msvc-orders -> /api/v1/orden)
  async listarOrdenes() {
    const res = await solicitar('/orden');
    return extraerLista(res);
  },

  async actualizarEstadoOrden(id, estado) {
    return solicitar(`/orden/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
  },

  // PAGOS (msvc-payments -> /api/v1/pago)
  async listarPagos() {
    const res = await solicitar('/pago');
    return extraerLista(res);
  },

  async actualizarPago(id, _pagoCompleto, nuevoEstado) {
  return solicitar(`/pago/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      estado: nuevoEstado,
    }),
  });
},

  // ENVÍOS / DESPACHOS (msvc-shipping -> /api/v1/shipping)
  async listarEnvios() {
    const res = await solicitar('/shipping');
    return extraerLista(res);
  },

  async crearEnvio(datos) {
    return solicitar('/shipping', {
      method: 'POST',
      body: JSON.stringify(datos),
    });
  },
};
