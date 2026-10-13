import {CATEGORIAS, ICONOS} from '../../data/categorias.js';
import TarjetaCategorias from './TarjetaCategoria.jsx';
import './PanelCategorias.css';

export default function PanelCategorias () {
    return (
        <div className="panel-categorias">
            {CATEGORIAS.map((categoria, index) => (
                <TarjetaCategorias key={index} title={categoria} icon={ICONOS[index]} />
            ))}
        </div>
    );
}
