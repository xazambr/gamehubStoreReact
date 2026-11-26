import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import Layout from "../../components/Layout.jsx";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const ubicacion = useLocation();

  const [esRegistro, setEsRegistro] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function manejarSubmit(e) {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    try {
      if (esRegistro) {
        await register({
          username: form.username,
          email: form.email,
          password: form.password,
        });
      } else {
        await login({
          username: form.username,
          password: form.password,
        });
      }
      const destino = ubicacion.state?.desde ?? '/';
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message || 'No se pudo completar la operación');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Layout>
    <div className="container py-5" style={{ maxWidth: '420px' }}>
      <h2 className="mb-4 text-center">
        {esRegistro ? 'Crear cuenta' : 'Iniciar sesión'}
      </h2>

      <form onSubmit={manejarSubmit}>
        <div className="mb-3">
          <label className="form-label">Usuario</label>
          <input
            name="username"
            type="text"
            className="form-control"
            placeholder="Ingresa tu usuario"
            value={form.username}
            onChange={cambiar}
            required
          />
        </div>

        {esRegistro && (
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={cambiar}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="********"
            value={form.password}
            onChange={cambiar}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="btn btn-primary w-100" disabled={enviando}>
          {enviando
            ? 'Procesando...'
            : esRegistro
            ? 'Registrarme'
            : 'Entrar'}
        </button>
      </form>

      <div className="text-center mt-3">
        <button
          type="button"
          className="btn btn-link"
          onClick={() => {
            setEsRegistro(!esRegistro);
            setError(null);
          }}
        >
          {esRegistro
            ? '¿Ya tienes cuenta? Inicia sesión'
            : '¿No tienes cuenta? Regístrate'}
        </button>
      </div>
    </div>
    </Layout>
  );
}