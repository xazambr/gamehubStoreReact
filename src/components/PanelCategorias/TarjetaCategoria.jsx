import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import './TarjetaCategorias.css';

export default function TarjetaCategorias({ nombre, icono: Icono, slug }) {
  return (
    <Link to={`/catalogo?categoria=${slug}`} className="tarjetaCategoria">
      <div className="iconoContenedor">
        <Icono />
      </div>
      
      <div>
        <h6 className="nombreCategoria">{nombre}</h6>
      </div>

      <div className="flechaContenedor">
        <FaChevronRight />
      </div>
    </Link>
  );
}