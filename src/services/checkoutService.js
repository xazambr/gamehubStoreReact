import { solicitar } from './api';
import { inventarioService } from './inventarioService';

export const checkoutService = {
  // Consulta promociones activas desde msvc-promotion
  async validarPromocion(codigo) {
    const limpio = (codigo || '').trim().toUpperCase();
    if (!limpio) throw new Error('Ingresa un código de cupón.');

    try {
      const lista = await solicitar('/promociones');
      const promociones = Array.isArray(lista) ? lista : [];
      const encontrada = promociones.find(
        (p) =>
          (p.codigo || '').trim().toUpperCase() === limpio &&
          (p.activo === undefined || p.activo === true)
      );

      if (encontrada) {
        return {
          codigo: limpio,
          porcentaje: Number(encontrada.descuentoPorcentaje ?? encontrada.porcentaje ?? encontrada.descuento ?? 10),
        };
      }
    } catch {
      // Si msvc-promotion no responde o está vacío, usa el fallback local GAMER10
    }

    if (limpio === 'GAMER10') {
      return { codigo: 'GAMER10', porcentaje: 10 };
    }

    throw new Error('Cupón inválido o vencido.');
  },

  // Ejecuta el flujo completo de compra: Reservar Stock -> Crear Orden -> Registrar Pago
async procesarCompra({ usuario, carrito, direccionEnvio, metodoPago, subtotal, descuento, costoEnvio, total, cupon }) {
  if (!carrito || carrito.length === 0) {
    throw new Error('Tu carrito está vacío.');
  }

  // 1. Crear la orden en msvc-orders (el propio backend reserva el stock en msvc-inventory)
  const payloadOrden = {
    usuarioId: Number(usuario?.id ?? 1),
    username: usuario?.username || usuario?.email || 'cliente',
    metodoPago: metodoPago || 'TARJETA_CREDITO',
    juegosIds: carrito.flatMap((item) =>
      Array.from({ length: Number(item.cantidad) }, () => Number(item.id))
    ),
    direccionEnvio,
    cuponAplicado: cupon || null,
    subtotal: Math.round(subtotal),
    descuento: Math.round(descuento),
    costoEnvio: Math.round(costoEnvio),
    total: Math.round(total),
    estado: 'PENDIENTE',
  };

  const ordenCreada = await solicitar('/orden', {
    method: 'POST',
    body: JSON.stringify(payloadOrden),
  });

  const ordenId = ordenCreada?.id ?? ordenCreada?.ordenId;

  // 2. Registrar el pago en msvc-payments
  if (ordenId) {
    await solicitar('/pago', {
      method: 'POST',
      body: JSON.stringify({
        ordenId: Number(ordenId),
        monto: Math.round(total),
        metodoPago: metodoPago || 'TARJETA_CREDITO',
        estado: 'PENDIENTE',
      }),
    });
  }

  return ordenCreada;
}
};