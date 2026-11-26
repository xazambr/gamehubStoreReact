import { solicitar } from './api';
import { resolverIdUsuarioReal } from './ordenesService';

// Extrae el arreglo de datos tanto si el backend devuelve [...] como si devuelve HATEOAS {_embedded: {...}}
function extraerLista(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  if (respuesta?._embedded && typeof respuesta._embedded === 'object') {
    const primeraClave = Object.keys(respuesta._embedded)[0];
    if (primeraClave && Array.isArray(respuesta._embedded[primeraClave])) {
      return respuesta._embedded[primeraClave];
    }
  }
  return [];
}

export const operacionService = {
  // ==========================================
  // ÓRDENES (msvc-orders -> /api/v1/orden)
  // ==========================================
  async listarOrdenes() {
    const res = await solicitar('/orden');
    return extraerLista(res);
  },

  async listarOrdenesCliente(usuario) {
    const usuarioId = await resolverIdUsuarioReal(usuario);

    if (!usuarioId) {
      return [];
    }

    try {
      const resPorUsuario = await solicitar(`/orden/usuario/${usuarioId}`);
      const lista = extraerLista(resPorUsuario);
      if (lista.length > 0) return lista;
    } catch {
      // Fallback a GET /orden filtrado por usuarioId
    }

    const todas = await this.listarOrdenes();
    return todas.filter((o) => Number(o.usuarioId) === usuarioId);
  },

  async crearOrden(datosOrden) {
    return solicitar('/orden', {
      method: 'POST',
      body: JSON.stringify(datosOrden),
    });
  },

  async actualizarEstadoOrden(id, nuevoEstado) {
    return solicitar(`/orden/${Number(id)}/estado?estado=${encodeURIComponent(nuevoEstado)}`, {
      method: 'PUT',
    });
  },

  // ==========================================
  // PAGOS (msvc-payments -> /api/v1/pago)
  // ==========================================
  async listarPagos() {
    const res = await solicitar('/pago');
    return extraerLista(res);
  },

  async registrarPago(datosPago) {
    return solicitar('/pago', {
      method: 'POST',
      body: JSON.stringify(datosPago),
    });
  },

  async actualizarPago(id, _pagoCompleto, nuevoEstado) {
    return solicitar(`/pago/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        estado: nuevoEstado,
      }),
    });
  },

  // ==========================================
  // DESPACHOS / ENVÍOS (msvc-shipping -> /api/v1/shipping)
  // ==========================================
 async listarEnvios() {
    const res = await solicitar('/shipping');
    return extraerLista(res);
  },

  async crearEnvio(datosEnvio) {
    const payload = {
      ordenId: Number(datosEnvio.ordenId),
      direccionDestino: datosEnvio.direccionDestino || datosEnvio.direccion || 'Por confirmar',
      empresaTransporte: datosEnvio.empresaTransporte || datosEnvio.transportista || 'Chilexpress',
    };

    return solicitar('/shipping', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async actualizarEnvio(id, datosEnvio) {
    const nuevoEstado = typeof datosEnvio === 'string'
      ? datosEnvio
      : (datosEnvio?.estadoEnvio ?? datosEnvio?.estado);

    return solicitar(`/shipping/${Number(id)}/estado?nuevoEstado=${encodeURIComponent(nuevoEstado)}`, {
      method: 'PUT',
    });
  },

  // ==========================================
  // PROMOCIONES (msvc-promotion -> /api/v1/promociones)
  // ==========================================
  async listarPromociones() {
    const res = await solicitar('/promociones');
    return extraerLista(res);
  },

  async crearPromocion(datosPromo) {
    const fechaInicioFormateada = datosPromo.fechaInicio?.includes('T')
      ? datosPromo.fechaInicio
      : `${datosPromo.fechaInicio}T00:00:00`;

    const fechaExpiracionFormateada = datosPromo.fechaFin?.includes('T')
      ? datosPromo.fechaFin
      : `${datosPromo.fechaFin}T23:59:59`;

    const payload = {
      codigo: String(datosPromo.codigo || '').trim().toUpperCase(),
      porcentajeDescuento: Number(datosPromo.descuentoPorcentaje),
      fechaInicio: fechaInicioFormateada,
      fechaExpiracion: fechaExpiracionFormateada,
      topeDeUsos: Number(datosPromo.topeUsos),
      activo: true,
    };

    return solicitar('/promociones', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};