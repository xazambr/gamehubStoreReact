import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

export default function RutaProtegida({ children, rolesPermitidos }) {
  const { autenticado, usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <Layout>
        <main className="container py-5 text-light">
          <div className="alert alert-info">Verificando sesión...</div>
        </main>
      </Layout>
    );
  }

  // 1. Si no tiene sesión iniciada -> 401 / Redirigir a Login
  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  // 2. Si tiene sesión iniciada pero NO tiene el rol requerido -> Pantalla 403
  const rolesUsuario = usuario?.roles || [];
  const tienePermiso =
    !rolesPermitidos ||
    rolesPermitidos.some((rol) => rolesUsuario.includes(rol));

  if (!tienePermiso) {
    return (
      <Layout>
        <main className="container py-5 text-center text-light">
          <div className="card bg-dark border-danger mx-auto p-4" style={{ maxWidth: '520px' }}>
            <h1 className="display-4 fw-bold text-danger">403</h1>
            <h2 className="fs-4 mb-3">Acceso Denegado</h2>
            <p className="text-secondary mb-4">
              Tu cuenta (<strong>{usuario?.username}</strong>) tiene rol de{' '}
              <code>{rolesUsuario.join(', ') || 'CLIENTE'}</code> y no cuenta con permisos
              para ingresar a esta sección.
            </p>
            <Link to="/" className="btn btn-primary">
              Volver al inicio
            </Link>
          </div>
        </main>
      </Layout>
    );
  }

  return children;
}
