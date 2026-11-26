import { API_URL } from '../../config'
import { leerSesion, borrarSesion } from './sesion';

export async function solicitar(ruta, opciones = {}) {
  const token = leerSesion()?.token;
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: { ...headers, ...opciones.headers },
  });

if (res.status === 401 && token && (ruta.startsWith('/auth') || ruta.startsWith('/usuarios'))) {
  borrarSesion();
  window.dispatchEvent(new Event('sesion-expirada'));
}

  if (res.status === 403) {
  throw new Error('Error 403: No tienes permisos para realizar esta acción.');
}

  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}));
    throw new Error(cuerpo.mensaje || cuerpo.message || `Error ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}