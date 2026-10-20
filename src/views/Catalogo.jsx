import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { FiltroCatalogo } from '../components/FiltroCatalogo/FiltroCatalogo';
import { ListaProductos } from '../components/Productos/ListaProductos';

import { PRODUCTOS } from '../data/productos';

import { formatearCLP } from '../utils/utils';
import {
  obtenerCategoriasUnicas,
  obtenerMarcasUnicas,
  validarRangoPrecios,
  filtrarYOrdenarProductos
} from '../utils/catalogo';

const filtrosIniciales = {
  categoria: '',
  marca: '',
  precioMin: '',
  precioMax: '',
  soloStock: false
};


export default function Catalogo() {

  const [filtros, setFiltros] = useState({
    categoria: '',
    marca: '',
    precioMin: '',
    precioMax: '',
    soloStock: false
  });

  const [orden, setOrden] = useState('nombre-asc');

  const categorias = useMemo(() => obtenerCategoriasUnicas(PRODUCTOS), []);
  const marcas = useMemo(() => obtenerMarcasUnicas(PRODUCTOS), []);

  const errorRango = validarRangoPrecios(filtros.precioMin, filtros.precioMax);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleLimpiarFiltros = () => {
    setFiltros(filtrosIniciales);
    setOrden('nombre-asc');
  };

  const productosFiltrados = useMemo(() => {
    return filtrarYOrdenarProductos(PRODUCTOS, filtros, orden);
  }, [filtros, orden]);

  return (
    <Layout>
      <main className="py-5">
        <div className="container-xl">
          <h1 className="fs-4 mb-4 text-light">CATÁLOGO</h1>

          <div className="row g-4 align-items-start">
            <div className="col-12 col-lg-3">
              <FiltroCatalogo
                filtros={filtros}
                onChangeFiltro={handleFiltroChange}
                onLimpiarFiltros={handleLimpiarFiltros}
                categorias={categorias}
                marcas={marcas}
                errorRango={errorRango}
              />
            </div>

            <div className="col-12 col-lg-9">
              <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                <p className="mb-0" style={{ color: 'var(--color-muted)', fontSize: '.875rem' }}>
                  <span className="mono" style={{ color: 'var(--color-acento)', fontWeight: 600 }}>
                    {productosFiltrados.length}
                  </span> productos
                </p>

                <div className="d-flex align-items-center gap-2">
                  <label htmlFor="orden" className="form-label mb-0" style={{ fontSize: '.8rem', whiteSpace: 'nowrap' }}>
                    Ordenar:
                  </label>
                  <select
                    id="orden"
                    className="form-select form-select-sm"
                    style={{ width: 'auto' }}
                    value={orden}
                    onChange={(e) => setOrden(e.target.value)}
                  >
                    <option value="nombre-asc">Nombre A→Z</option>
                    <option value="nombre-desc">Nombre Z→A</option>
                    <option value="precio-asc">Precio menor</option>
                    <option value="precio-desc">Precio mayor</option>
                  </select>
                </div>
              </div>

              <ListaProductos productos={productosFiltrados} formatearPrecio={formatearCLP} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}