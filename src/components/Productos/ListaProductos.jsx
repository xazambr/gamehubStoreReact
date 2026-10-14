import React from 'react';
import './ListaProductos.css';
import { TarjetaProducto } from './TarjetaProducto';
import { PRODUCTOS } from '../data/productos'; // Ajustar la ruta si da error

export function ListaProductos({ productos = PRODUCTOS }) {
  // estado vacío (sin coincidencias o array vacío)
  if (!productos || productos.length === 0) {
    return (
      <div id="estado-vacio" className="vacio text-center py-5">
        <div className="vacio-icono fs-1 mb-2">🔍</div>
        <h3 className="text-light">Sin resultados</h3>
        <p className="text-muted-gh">Ajusta los filtros de búsqueda para ver más productos.</p>
      </div>
    );
  }

  // tabla de productos
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