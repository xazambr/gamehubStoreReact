export default function Header() {
    return <header>
    <a href="index.html" className="logo">Gamehub Store</a>
    <nav aria-label="Menú de navegación principal" className="nav-links">
      <ul className="nav-list">
        <li><a href="index.html">Inicio</a></li>
        <li><a href="catalogo.html">Catalogo</a></li>
        <li><a href="ordenes.html">Mis Ordenes</a></li>
        <li><a href="carrito.html">Carrito 🛒</a></li>
      </ul>
    </nav>
  </header>
}