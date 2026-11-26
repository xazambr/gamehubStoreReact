import { solicitar } from './api';

export const ordenesService = {
<<<<<<< HEAD
  listar: () => solicitar('/ordenes'),
  obtener: (id) => solicitar(`/ordenes/${id}`),
  crear: (orden) =>
    solicitar('/ordenes', {
=======
  listar: () => solicitar('/orden'),
  obtener: (id) => solicitar(`/orden/${id}`),
  listarPorUsuario: (usuarioId) => solicitar(`/orden/usuario/${usuarioId}`),
  crear: (orden) =>
    solicitar('/orden', {
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
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