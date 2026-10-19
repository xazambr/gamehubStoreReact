import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { FiltroCatalogo } from '../components/FiltroCatalogo/FiltroCatalogo';
import { ListaProductos } from '../components/ListaProductos/ListaProductos';
import { PRODUCTOS } from '../data/productos';

export default function Catalogo() {
  const [filtros, setFiltros] = useState({
    categoria: '',
    marca: '',
    precioMin: '',
    precioMax: '',
    soloStock: false
  });

  const [orden, setOrden] = useState('nombre-asc');

  const categorias = useMemo(() => [...new Set(PRODUCTOS.map(p => p.categoria).filter(Boolean))], []);
  const marcas = useMemo(() => [...new Set(PRODUCTOS.map(p => p.marca).filter(Boolean))], []);

  const minNum = parseFloat(filtros.precioMin);
  const maxNum = parseFloat(filtros.precioMax);
  const errorRango = !isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum;

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      categoria: '',
      marca: '',
      precioMin: '',
      precioMax: '',
      soloStock: false
    });
    setOrden('nombre-asc');
  };

  const productosFiltrados = useMemo(() => {
    if (errorRango) return [];

    let res = [...PRODUCTOS];
    const precioFinal = (p) => p.descuento > 0 ? p.precio * (1 - p.descuento / 100) : p.precio;

    if (filtros.categoria) res = res.filter(p => p.categoria === filtros.categoria);
    if (filtros.marca) res = res.filter(p => p.marca === filtros.marca);
    if (filtros.soloStock) res = res.filter(p => p.stock > 0);
    if (!isNaN(minNum)) res = res.filter(p => precioFinal(p) >= minNum);
    if (!isNaN(maxNum)) res = res.filter(p => precioFinal(p) <= maxNum);

    switch (orden) {
      case 'precio-asc':  res.sort((a,b) => precioFinal(a) - precioFinal(b)); break;
      case 'precio-desc': res.sort((a,b) => precioFinal(b) - precioFinal(a)); break;
      case 'nombre-desc': res.sort((a,b) => b.nombre.localeCompare(a.nombre)); break;
      default:            res.sort((a,b) => a.nombre.localeCompare(b.nombre));
    }

    return res;
  }, [filtros, orden, errorRango, minNum, maxNum]);

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

              <ListaProductos productos={productosFiltrados} />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}