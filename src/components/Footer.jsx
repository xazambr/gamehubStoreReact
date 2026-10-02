export default function Footer() {
  return (
    <footer>

    <section className="footer-brand">
      <h2>GAMEHUB STORE</h2>
      <p>La tienda gamer más completa de Chile.</p>
      <p>Notebooks, GPUs, consolas, periféricos y más</p>
    </section>

    <nav aria-label="Categorías de productos" className="footer-nav">
      <h3>Categorías</h3>
      <ul>
        <li><a href="#">Notebooks</a></li>
        <li><a href="#">Tarjetas Gráficas</a></li>
        <li><a href="#">Procesadores</a></li>
        <li><a href="#">Periféricos</a></li>
        <li><a href="#">Consolas</a></li>
        <li><a href="#">Monitores</a></li>
      </ul>
    </nav>

    <nav aria-label="Enlaces de ayuda" className="footer-nav">
      <h3>Ayuda</h3>
      <ul>
        <li>Preguntas Frecuentes</li>
        <li>Política de Devoluciones</li>
        <li>Garantías</li>
        <li>Seguimiento de Orden</li>
        <li>Contacto</li>
      </ul>
    </nav>

    <section className="footer-contact">
      <h3>Contacto</h3>
      <address>
        <p>📧soporte@gamehub.cl</p>
        <p>📞 +56 2 2345 6789</p>
        <p>🕐 <time dateTime="Mo-Fr 09:00-18:00">Lun–Vie 9:00–18:00</time></p>
        <p>📍 Santiago, Chile</p>
      </address>
    </section>

  </footer>
  )
}