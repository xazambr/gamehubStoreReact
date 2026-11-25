import { solicitar } from './api';

export const promocionesService = {
  listar: () => solicitar('/promociones'),
  validarCupon: (codigo) => solicitar(`/promociones/validar/${codigo}`),
  crear: (promocion) =>
    solicitar('/promociones', {
      method: 'POST',
      body: JSON.stringify(promocion),
    }),
};