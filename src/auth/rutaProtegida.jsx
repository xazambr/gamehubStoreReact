import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function RutaProtegida({ children, rol }) {
  const { autenticado, usuario } = useAuth();
  const ubicacion = useLocation();

  if (!autenticado) {
    const desde = ubicacion.pathname;
    return <Navigate to="/login" replace state={{ desde }} />;
  }

  if (rol && !usuario.roles.includes(rol)) {
    return (
      <div className="container py-5 text-center">
        <h2>Acceso denegado</h2>
        <p>No tienes permiso para ver esta página.</p>
      </div>
    );
  }

  return children;
}