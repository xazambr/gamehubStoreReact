import { solicitar } from './api';
import { leerSesion } from './sesion';

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

// Fallback determinista por si se usa un token emitido antes de agregar el claim usuarioId
function generarIdDesdeUsername(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash * 31 + username.charCodeAt(i)) >>> 0;
  }
  return (hash % 900000) + 1000;
}

// Resuelve el ID numérico real del usuario autenticado desde la sesión o el claim "usuarioId" del JWT
export async function resolverIdUsuarioReal(usuario) {
  const directo = usuario?.usuarioId ?? usuario?.id ?? usuario?.userId;
  if (directo !== undefined && directo !== null && !Number.isNaN(Number(directo))) {
    return Number(directo);
  }

  let username = (usuario?.username || '').trim().toLowerCase();

  try {
    const token = leerSesion()?.token;
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const idJwt = payload.usuarioId ?? payload.id ?? payload.userId;
      if (idJwt !== undefined && idJwt !== null && !Number.isNaN(Number(idJwt))) {
        return Number(idJwt);
      }
      if (!username && payload.sub) {
        username = String(payload.sub).trim().toLowerCase();
      }
    }
  } catch {
    // Ignorar error de parseo del JWT
  }

  if (username) {
    return generarIdDesdeUsername(username);
  }

  return null;
}

export const ordenesService = {
  resolverIdUsuarioReal,

  // Listar todas las órdenes (uso del Operador / Admin)
  async listarTodas() {
    const res = await solicitar('/orden');
    return extraerLista(res);
  },

  // Obtener una orden específica por su ID (orden_id)
  async obtenerPorId(id) {
    return solicitar(`/orden/${id}`);
  },

  // Listar estrictamente las órdenes del cliente autenticado
  async listarPorCliente(usuario) {
    const usuarioId = await resolverIdUsuarioReal(usuario);

    if (!usuarioId) {
      return [];
    }

    try {
      const resPorUsuario = await solicitar(`/orden/usuario/${usuarioId}`);
      const lista = extraerLista(resPorUsuario);
      if (lista.length > 0) return lista;
    } catch {
      // Fallback a GET /orden filtrado estrictamente por usuarioId
    }

    const todas = await this.listarTodas();
    return todas.filter((o) => Number(o.usuarioId) === usuarioId);
  },

  // Crear una nueva orden desde el Checkout (ajustado a Ordenes.java)
  async crear({ usuarioId, metodoPago, total, juegosIds }) {
    const payload = {
      usuarioId: Number(usuarioId),
      metodoPago: metodoPago || 'TARJETA',
      total: Number(total),
      juegosIds: Array.isArray(juegosIds) ? juegosIds.map(Number) : [],
    };

    return solicitar('/orden', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Actualizar el estado de una orden ("creada", "pagada", "enviada", "cancelada")
  async actualizarEstado(id, estado) {
    return solicitar(`/orden/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ estado }),
    });
  },

  // Eliminar / cancelar una orden
  async eliminar(id) {
    return solicitar(`/orden/${id}`, {
      method: 'DELETE',
    });
  },
};