import { useState, useEffect } from 'react';
import { AuthContext } from './useAuth';
import { authService } from '../services/authService';
import { leerSesion, guardarSesion, borrarSesion } from '../services/sesion';

export default function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesion);

  useEffect(() => {
    const alExpirar = () => setSesion(null);
    window.addEventListener('sesion-expirada', alExpirar);
    return () => window.removeEventListener('sesion-expirada', alExpirar);
  }, []);

  async function login(credenciales) {
    const datos = await authService.login(credenciales);
    guardarSesion(datos);
    setSesion(datos);
  }

  async function register(datosRegistro) {
    const datos = await authService.register(datosRegistro);
    guardarSesion(datos);
    setSesion(datos);
  }

  function logout() {
    borrarSesion();
    setSesion(null);
  }

  const valor = {
    login,
    register,
    logout,
    autenticado: sesion !== null,
    usuario: sesion
      ? { username: sesion.username, roles: sesion.roles || [] }
      : null,
  };

  return <AuthContext value={valor}>{children}</AuthContext>;
}