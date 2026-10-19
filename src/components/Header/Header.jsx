import { Link, NavLink } from "react-router-dom";
import { FiShoppingCart } from 'react-icons/fi';
import { useCarrito } from "../../context/CartContext";
import "./Header.css";

const navItems = [
  { name: "Inicio", to: "/" },
  { name: "Catalogo", to: "/catalogo" },
  { name: "Mis Ordenes", to: "/ordenes" }
];

export default function Header() {
  const { totalItems } = useCarrito();

  return <header className="sticky-top">
    <div className="container d-flex align-items-center justify-content-between">
      <Link to="/" className="logo"><span className="game-logo">Game</span><span className="hub-logo">Hub</span> <span className="store-logo">Store</span></Link>
      <nav aria-label="Menú de navegación principal" className="d-flex align-items-center gap-4">
        <ul className="d-flex align-items-center gap-4 ">
          {navItems.map((item, index) => (
            <li className="nav-item d-flex align-items-center gap-4" key={index}>
              <NavLink to={item.to} className={({ isActive }) =>
                `${"nav-item"} ${isActive ? "nav-item-active" : ''}`
              }>{item.name}</NavLink>
            </li>
          ))}
        </ul>
        <Link to="/carrito" className="btnCarrito">
          <FiShoppingCart className="iconoCarrito" />
          {totalItems > 0 && (
            <span className="badgeCarrito">
              {totalItems}
            </span>
          )}
        </Link>
      </nav>
    </div>

  </header>
}