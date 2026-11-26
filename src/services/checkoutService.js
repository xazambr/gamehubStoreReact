import { solicitar } from './api';
import { resolverIdUsuarioReal } from './ordenesService';

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
          porcentaje: Number(
            encontrada.porcentajeDescuento ??
            encontrada.descuentoPorcentaje ??
            encontrada.porcentaje ??
            encontrada.descuento
          ),
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

  // Ejecuta el flujo completo de compra: Crear Orden (reserva stock) -> Registrar Pago
  async procesarCompra({
    usuario,
    carrito,
    direccionEnvio,
    metodoPago,
    subtotal,
    descuento,
    costoEnvio,
    total,
    cupon,
  }) {
    if (!carrito || carrito.length === 0) {
      throw new Error('Tu carrito está vacío.');
    }

    // Obtener el ID numérico real del usuario autenticado (sesión, JWT o msvc-users)
    const usuarioId = await resolverIdUsuarioReal(usuario);
    if (!usuarioId) {
      throw new Error('No se pudo identificar tu ID de usuario. Vuelve a iniciar sesión e inténtalo de nuevo.');
    }

    // 1. Crear la orden en msvc-orders (el propio backend reserva el stock en msvc-inventory)
    const payloadOrden = {
      usuarioId: Number(usuarioId),
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

    // 2. Registrar el pago en msvc-payments vinculado al ordenId real
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
  },
};