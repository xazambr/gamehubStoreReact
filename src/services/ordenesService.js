import { solicitar } from './api';

export const ordenesService = {
  listar: () => solicitar('/ordenes'),
  obtener: (id) => solicitar(`/ordenes/${id}`),
  crear: (orden) =>
    solicitar('/ordenes', {
      method: 'POST',
      body: JSON.stringify(orden),
    }),
  registrarPago: (pago) =>
    solicitar('/pagos', {
      method: 'POST',
      body: JSON.stringify(pago),
    }),
  obtenerEnvioPorOrden: (ordenId) => solicitar(`/envios/orden/${ordenId}`),
  generarEnvio: (envio) =>
    solicitar('/envios', {
      method: 'POST',
      body: JSON.stringify(envio),
    }),
};