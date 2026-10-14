export default function Footer() {
  return (
    <footer>
      <div className="container-xl">
        {/* PRIMERA SECCIÓN: COLUMNAS DE INFORMACIÓN */}
        <div className="row g-4 mb-4">
          <section className="col-12 col-sm-6 col-lg-3 footer-brand footer-col">
            <h2>GAMEHUB STORE</h2>
            <p>La tienda gamer más completa de Chile.</p>
            <p>Notebooks, GPUs, consolas, periféricos y más.</p>
          </section>

          <nav aria-label="Categorías de productos" className="col-6 col-sm-3 col-lg-2 footer-nav footer-col">
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

          <nav aria-label="Enlaces de ayuda" className="col-6 col-sm-3 col-lg-3 footer-nav footer-col">
            <h3>Ayuda</h3>
            <ul>
              <li><a href="#">Preguntas Frecuentes</a></li>
              <li><a href="#">Política de Devoluciones</a></li>
              <li><a href="#">Garantías</a></li>
              <li><a href="#">Seguimiento de Orden</a></li>
              <li><a href="#">Contacto</a></li>
            </ul>
          </nav>

          <section className="col-12 col-sm-6 col-lg-4 footer-contact footer-col">
            <h3>Contacto</h3>
            <address>
              <p>📧 soporte@gamehub.cl</p>
              <p>📞 +56 2 2345 6789</p>
              <p>⏰ <time dateTime="Mo-Fr 09:00-18:00">Lun-Vie 9:00-18:00</time></p>
              <p>📍 Santiago, Chile</p>
            </address>
          </section>
        </div>

        {/* SEGUNDA SECCIÓN: DIVISOR NEÓN Y COPYRIGHT */}
        <hr className="neon-divider" />

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3">
          <p className="mb-0 text-muted-gh text-sm">
            © 2026 GameHub Store · Desarrollo FullStack II · DSY1104
          </p>
          <div className="d-flex gap-3">
            <span className="text-muted-gh text-sm">Términos</span>
            <span className="text-muted-gh text-sm">Privacidad</span>
            <span className="text-muted-gh text-sm">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}