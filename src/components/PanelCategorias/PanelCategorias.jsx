import { 
  BsLaptop, 
  BsGpuCard, 
  BsCpu, 
  BsMouse, 
  BsController, 
  BsDisplay 
} from 'react-icons/bs';

import  TarjetaCategorias  from './TarjetaCategoria.jsx';
import './PanelCategorias.css';

const CATEGORIAS = [
  { id: 1, nombre: 'Notebooks', icono: BsLaptop, slug: 'notebooks' },
  { id: 2, nombre: 'Tarjetas Gráficas', icono: BsGpuCard, slug: 'tarjetas-graficas' },
  { id: 3, nombre: 'Procesadores', icono: BsCpu, slug: 'procesadores' },
  { id: 4, nombre: 'Periféricos', icono: BsMouse, slug: 'perifericos' },
  { id: 5, nombre: 'Consolas', icono: BsController, slug: 'consolas' },
  { id: 6, nombre: 'Monitores', icono: BsDisplay, slug: 'monitores' },
];

export default function SeccionCategorias() {
  return (
    <section className="categorias">
      <div className="container">
        <p className="subtitulo">ENCUENTRA TU PRÓXIMO UPGRADE</p>
        <h2 className="titulo">Explora por categoría</h2>

        <div className="row g-3">
          {CATEGORIAS.map((cat) => (
            <div key={cat.id} className="col-12 col-sm-6 col-md-4 col-lg-2">
              <TarjetaCategorias 
                nombre={cat.nombre} 
                icono={cat.icono} 
                slug={cat.slug} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}