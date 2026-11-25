import { solicitar } from './api';

export const categoriasService = {
  listar: (opciones) => solicitar('/categorias', opciones),
  obtener: (id, opciones) => solicitar(`/categorias/${id}`, opciones),
};