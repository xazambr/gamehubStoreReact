import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiShoppingCart } from 'react-icons/fi';
import { useCarrito } from "../../context/CartContext";
import { useAuth } from "../../auth/useAuth";
import "./Header.css";

export default function Header() {
  const { totalItems } = useCarrito();
  const { autenticado, usuario, logout } = useAuth();
  const navigate = useNavigate();

  const roles = usuario?.roles || [];
  const esAdmin = roles.includes('ROLE_ADMIN');
  const esOperador = roles.includes('ROLE_OPERADOR') || esAdmin;

  const manejarLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky-top">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="logo">
          <span className="game-logo">Game</span>
          <span className="hub-logo">Hub</span>{" "}
          <span className="store-logo">Store</span>
        </Link>

        <nav aria-label="Menú de navegación principal" className="d-flex align-items-center gap-4">
          <ul className="d-flex align-items-center gap-4 mb-0">
            <li className="nav-item">
              <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                Inicio
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/catalogo" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                Catálogo
              </NavLink>
            </li>

            {autenticado && (
              <li className="nav-item">
                <NavLink to="/ordenes" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                  Mis Órdenes
                </NavLink>
              </li>
            )}

            {esOperador && (
              <li className="nav-item">
                <NavLink to="/operador" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                  Operador
                </NavLink>
              </li>
            )}

            {esAdmin && (
              <li className="nav-item">
                <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          <Link to="/carrito" className="btnCarrito">
            <FiShoppingCart className="iconoCarrito" />
            {totalItems > 0 && (
              <span className="badgeCarrito">{totalItems}</span>
            )}
          </Link>

          {autenticado ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-light small">Hola, {usuario.username}</span>
              <button onClick={manejarLogout} className="btn btn-outline-light btn-sm">
                Salir
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Iniciar sesión
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}