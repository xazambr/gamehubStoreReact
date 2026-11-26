import { solicitar } from './api';

export const categoriasService = {
  listar: () => solicitar('/categorias'),
  crear: (categoria) =>
    solicitar('/categorias', {
      method: 'POST',
      body: JSON.stringify(categoria),
    }),
  actualizar: (id, categoria) =>
    solicitar(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoria),
    }),
  eliminar: (id) => solicitar(`/categorias/${id}`, { method: 'DELETE' }),
};