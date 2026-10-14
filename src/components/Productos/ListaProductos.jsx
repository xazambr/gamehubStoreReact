import React from 'react';
import './ListaProductos.css';
// actualizar la ruta de importación
import { TarjetaProducto } from '../TarjetaProducto/TarjetaProducto'; 

export function ListaProductos({ productos = [] }) {
  // 1. Ver si no hay productos que coincidan con los filtros
  if (!productos || productos.length === 0) {
    return (
      <div id="estado-vacio" className="vacio text-center py-5">
        <div className="vacio-icono fs-1">🔍</div>
        <h2 className="mt-3">Sin resultados</h2>
        <p>Ajusta los filtros para ver más productos.</p>
      </div>
    );
  }

  // 2. Tabla de productos
  return (
    <div id="grid-catalogo" className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-3">
      {productos.map((producto) => (
        <div className="col" key={producto.id}>
          <TarjetaProducto producto={producto} />
        </div>
      ))}
    </div>
  );
}