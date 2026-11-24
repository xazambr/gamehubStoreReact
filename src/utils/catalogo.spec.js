import {
  obtenerCategoriasUnicas,
  obtenerMarcasUnicas,
  validarRangoPrecios,
  obtenerPrecioEfectivo,
  filtrarYOrdenarProductos
} from './catalogo.js';

describe('Pruebas unitarias exhaustivas para catalogo.js', () => {

  const productosPrueba = [
    { id: 1, nombre: 'Console PS5', categoria: 'Consolas', marca: 'Sony', precio: 500000, descuento: 10, stock: 5 },
    { id: 2, nombre: 'Control Xbox', categoria: 'Accesorios', marca: 'Microsoft', precio: 60000, descuento: 0, stock: 0 },
    { id: 3, nombre: 'Juego Zelda', categoria: 'Juegos', marca: 'Nintendo', precio: 70000, descuento: 0, stock: 10 },
    { id: 4, nombre: 'Mouse Gamer', categoria: 'Accesorios', marca: 'Logitech', precio: 30000, descuento: 20, stock: 3 }
  ];

  it('debe obtener categorías únicas omitiendo valores nulos o duplicados', () => {
    const categorias = obtenerCategoriasUnicas([
      ...productosPrueba,
      { id: 5, nombre: 'Test', categoria: 'Consolas' },
      { id: 6, nombre: 'Test 2', categoria: null }
    ]);
    expect(categorias).toEqual(['Consolas', 'Accesorios', 'Juegos']);
  });

  it('debe obtener marcas únicas omitiendo valores vacíos', () => {
    const marcas = obtenerMarcasUnicas(productosPrueba);
    expect(marcas).toEqual(['Sony', 'Microsoft', 'Nintendo', 'Logitech']);
  });

  it('debe detectar correctamente si el precio mínimo supera al máximo', () => {
    expect(validarRangoPrecios('100000', '50000')).toBeTrue();
    expect(validarRangoPrecios('20000', '50000')).toBeFalse();
    expect(validarRangoPrecios('', '50000')).toBeFalse();
  });

  it('debe calcular el precio efectivo restando el descuento porcentaje', () => {
    expect(obtenerPrecioEfectivo(productosPrueba[0])).toBe(450000);
    expect(obtenerPrecioEfectivo(productosPrueba[3])).toBe(24000);
    expect(obtenerPrecioEfectivo(productosPrueba[1])).toBe(60000);
    expect(obtenerPrecioEfectivo(null)).toBe(0);
  });

  it('debe filtrar productos por categoría y marca simultáneamente', () => {
    const resultado = filtrarYOrdenarProductos(productosPrueba, { categoria: 'Accesorios', marca: 'Logitech' });
    expect(resultado.length).toBe(1);
    expect(resultado[0].nombre).toBe('Mouse Gamer');
  });

  it('debe filtrar por rango de precio basado en el precio efectivo', () => {
    const resultado = filtrarYOrdenarProductos(productosPrueba, { precioMin: '20000', precioMax: '65000' });
    expect(resultado.map(p => p.nombre)).toEqual(['Control Xbox', 'Mouse Gamer']);
  });

  it('debe ordenar productos por menor a mayor precio', () => {
    const resultado = filtrarYOrdenarProductos(productosPrueba, {}, 'precio-asc');
    expect(resultado[0].nombre).toBe('Mouse Gamer');
    expect(resultado[resultado.length - 1].nombre).toBe('Console PS5');
  });

  it('debe ordenar productos por mayor a menor precio', () => {
    const resultado = filtrarYOrdenarProductos(productosPrueba, {}, 'precio-desc');
    expect(resultado[0].nombre).toBe('Console PS5');
  });

  it('debe ordenar productos por nombre descendente (Z->A)', () => {
    const resultado = filtrarYOrdenarProductos(productosPrueba, {}, 'nombre-desc');
    expect(resultado[0].nombre).toBe('Mouse Gamer');
    expect(resultado[resultado.length - 1].nombre).toBe('Console PS5');
  });

  it('debe retornar un arreglo vacío si el rango de precios es inválido', () => {
    const resultado = filtrarYOrdenarProductos(productosPrueba, { precioMin: '100', precioMax: '10' });
    expect(resultado).toEqual([]);
  });

});