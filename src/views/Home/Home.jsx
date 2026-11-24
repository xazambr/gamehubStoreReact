import Layout from "../../components/Layout.jsx";
import PanelCategorias from "../../components/PanelCategorias/PanelCategorias.jsx";
import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import './Home.css'

export default function Home() {
  return (
    <Layout>
      <section className="heroSection">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-8">

              {/* Badge Ofertas */}
              <div className="badgeOfertas">
                <FiZap size={13} /> Ofertas Especiales Activas
              </div>

              {/* Subtítulo / Rastro */}
              <p className="subtituloHero">
                GAMEHUB / LEVEL UP YOUR SETUP
              </p>

              {/* Título Principal */}
              <h1 className="tituloHero">
                El gear que necesitas para <span className="textoCian">Dominar</span>
              </h1>

              {/* Descripción */}
              <p className="descripcionHero">
                Notebooks gaming, GPUs de última generación, consolas y periféricos
                seleccionados para llevar tu juego al siguiente nivel.
              </p>

              {/* Botones */}
              <div className="contenedorBotones">
                <Link to="/catalogo" className="btnMagenta">
                  Explorar catálogo <FiArrowRight />
                </Link>

                <Link to="/catalogo?ofertas=true" className="btnBordeCian">
                  Ver ofertas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PanelCategorias />
      
    </Layout>
  );
}