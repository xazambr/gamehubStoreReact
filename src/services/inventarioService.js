import { solicitar } from './api';

export const inventarioService = {
  listar: () => solicitar('/inventario'),
  obtenerPorProducto: (productoId) => solicitar(`/inventario/producto/${productoId}`),
  ajustarStock: (id, datos) =>
    solicitar(`/inventario/${id}`, {
      method: 'PUT',
      body: JSON.stringify(datos),
    }),
};