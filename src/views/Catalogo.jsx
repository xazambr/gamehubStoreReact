import { useState, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import { FiltroCatalogo } from '../components/FiltroCatalogo/FiltroCatalogo';
import { ListaProductos } from '../components/Productos/ListaProductos';
import { productosService } from '../services/productosService';

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
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [lento, setLento] = useState(false);
  const [error, setError] = useState(null);

  const [filtros, setFiltros] = useState(filtrosIniciales);
  const [orden, setOrden] = useState('nombre-asc');

  useEffect(() => {
    const controlador = new AbortController();
    const aviso = setTimeout(() => setLento(true), 4000);

    async function cargarCatalogo() {
      setCargando(true);
      setError(null);
      try {
        const datos = await productosService.listar({ signal: controlador.signal });
        setProductos(datos);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'No se pudo cargar el catálogo desde el servidor.');
        }
      } finally {
        clearTimeout(aviso);
        setCargando(false);
      }
    }

    cargarCatalogo();

    return () => {
      clearTimeout(aviso);
      controlador.abort();
    };
  }, []);

  const categorias = useMemo(() => obtenerCategoriasUnicas(productos), [productos]);
  const marcas = useMemo(() => obtenerMarcasUnicas(productos), [productos]);

  const errorRango = validarRangoPrecios(filtros.precioMin, filtros.precioMax);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleLimpiarFiltros = () => {
    setFiltros(filtrosIniciales);
    setOrden('nombre-asc');
  };

  const productosFiltrados = useMemo(() => {
    return filtrarYOrdenarProductos(productos, filtros, orden);
  }, [productos, filtros, orden]);

  return (
    <Layout>
      <main className="py-5">
        <div className="container-xl">
          <h1 className="fs-4 mb-4 text-light">CATÁLOGO</h1>

          {cargando && (
            <div className="alert alert-info" role="status">
              {lento
                ? 'El servidor se está activando, puede tardar un minuto...'
                : 'Cargando catálogo de productos...'}
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!cargando && !error && (
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

                {productosFiltrados.length === 0 ? (
                  <div className="alert alert-secondary" role="status">
                    No se encontraron productos disponibles con los filtros seleccionados.
                  </div>
                ) : (
                  <ListaProductos productos={productosFiltrados} formatearPrecio={formatearCLP} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}