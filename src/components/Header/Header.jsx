import {Link} from "react-router-dom";
import "./Header.css";

const navItems = [
  { name: "Inicio", to: "/" },
  { name: "Catalogo", to: "Catalogo" },
  { name: "Mis Ordenes", to: "Ordenes" }
];

export default function Header() {
    return <header>
    <Link to="/" className="logo"><span className="game-logo">Game</span><span className="hub-logo">Hub</span> <span className="store-logo">Store</span></Link>
    <nav aria-label="Menú de navegación principal" className="nav-links">
      <ul className="nav-list">
        {navItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <Link to={item.to}>{item.name}</Link>
          </li>
        ))}
      </ul>
      <a className="nav-cart" href="carrito.html">🛒</a>
    </nav>
  </header>
}