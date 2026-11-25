import { solicitar } from './api';

export const productosService = {
  listar: (opciones) => solicitar('/productos', opciones),
  obtener: (id, opciones) => solicitar(`/productos/${id}`, opciones),
  crear: (producto) =>
    solicitar('/productos', {
      method: 'POST',
      body: JSON.stringify(producto),
    }),
  actualizar: (id, producto) =>
    solicitar(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(producto),
    }),
  eliminar: (id) => solicitar(`/productos/${id}`, { method: 'DELETE' }),
};