import "./Header.css";

const navItems = [
  { name: "Inicio", href: "index.html" },
  { name: "Catalogo", href: "catalogo.html" },
  { name: "Mis Ordenes", href: "ordenes.html" }
];

export default function Header() {
    return <header>
    <a href="index.html" className="logo"><span className="game-logo">Game</span><span className="hub-logo">Hub</span> <span className="store-logo">Store</span></a>
    <nav aria-label="Menú de navegación principal" className="nav-links">
      <ul className="nav-list">
        {navItems.map((item, index) => (
          <li className="nav-item" key={index}>
            <a href={item.href}>{item.name}</a>
          </li>
        ))}
      </ul>
      <a className="nav-cart" href="carrito.html">🛒</a>
    </nav>
  </header>
}