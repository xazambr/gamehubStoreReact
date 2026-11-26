import { solicitar } from './api';

const IMAGENES_POR_CATEGORIA = {
  Notebooks: 'https://placehold.co/400x300/1b2838/66c0f4?text=Notebook',
  'Tarjetas Gráficas': 'https://placehold.co/400x300/1b2838/66c0f4?text=GPU',
  Procesadores: 'https://placehold.co/400x300/1b2838/66c0f4?text=CPU',
  Periféricos: 'https://placehold.co/400x300/1b2838/66c0f4?text=Periferico',
  Consolas: 'https://placehold.co/400x300/1b2838/66c0f4?text=Consola',
  Monitores: 'https://placehold.co/400x300/1b2838/66c0f4?text=Monitor',
};

const IMAGEN_DEFECTO = 'https://placehold.co/400x300/1b2838/66c0f4?text=GameHub+Store';

function extraerLista(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  if (respuesta?._embedded) {
    return Object.values(respuesta._embedded)[0] || [];
  }
  return [];
}

function normalizarProducto(p, mapaCategorias = {}, mapaStock = {}) {
  const id = p.id ?? p.productoId;
  const nombreCategoria =
    typeof p.categoria === 'string'
      ? p.categoria
      : p.categoria?.nombre ?? mapaCategorias[p.categoriaId] ?? 'Sin categoría';

  return {
    id,
    nombre: p.nombre,
    marca: p.marca,
    modelo: p.modelo ?? '',
    precio: Number(p.precio ?? 0),
    categoriaId: p.categoriaId,
    categoria: nombreCategoria,
    descripcion: p.descripcion ?? '',
    estado: p.estado,
    activo: (p.estado ?? '').toUpperCase() === 'ACTIVADO',
    stock:
      p.stock !== undefined
        ? Number(p.stock)
        : Number(mapaStock[id] ?? 10),
    imagen:
      p.imagenUrl ||
      p.imagen ||
      IMAGENES_POR_CATEGORIA[nombreCategoria] ||
      IMAGEN_DEFECTO,
  };
}

export const productosService = {
  async listar(opciones) {
    const [respProductos, respCategorias, respInventario] = await Promise.allSettled([
      solicitar('/productos', opciones),
      solicitar('/categorias', opciones),
      solicitar('/inventario', opciones),
    ]);

    if (respProductos.status === 'rejected') {
      throw respProductos.reason;
    }

    const listaProductos = extraerLista(respProductos.value);

    const mapaCategorias = {};
    if (respCategorias.status === 'fulfilled') {
      extraerLista(respCategorias.value).forEach((c) => {
        if ((c.estado ?? 'ACTIVADO').toUpperCase() === 'ACTIVADO') {
          mapaCategorias[c.id] = c.nombre;
        }
      });
    }

    const mapaStock = {};
    if (respInventario.status === 'fulfilled') {
      extraerLista(respInventario.value).forEach((inv) => {
        const prodId = inv.productoId ?? inv.producto?.id;
        if (prodId != null) {
          mapaStock[prodId] = inv.cantidad ?? inv.stock ?? 0;
        }
      });
    }

    return listaProductos
      .map((p) => normalizarProducto(p, mapaCategorias, mapaStock))
      .filter((p) => p.activo);
  },

  async obtener(id, opciones) {
    const [respProducto, respCategorias, respInventario] = await Promise.allSettled([
      solicitar(`/productos/${id}`, opciones),
      solicitar('/categorias', opciones),
      solicitar('/inventario', opciones),
    ]);

    if (respProducto.status === 'rejected') {
      throw respProducto.reason;
    }

    const mapaCategorias = {};
    if (respCategorias.status === 'fulfilled') {
      extraerLista(respCategorias.value).forEach((c) => {
        mapaCategorias[c.id] = c.nombre;
      });
    }

    const mapaStock = {};
    if (respInventario.status === 'fulfilled') {
      extraerLista(respInventario.value).forEach((inv) => {
        const prodId = inv.productoId ?? inv.producto?.id;
        if (prodId != null) {
          mapaStock[prodId] = inv.cantidad ?? inv.stock ?? 0;
        }
      });
    }

    return normalizarProducto(respProducto.value, mapaCategorias, mapaStock);
  },

  crear: (producto) =>
    solicitar('/productos', {
      method: 'POST',
      body: JSON.stringify({
        nombre: producto.nombre,
        marca: producto.marca,
        modelo: producto.modelo,
        precio: Number(producto.precio),
        categoriaId: Number(producto.categoriaId),
        descripcion: producto.descripcion,
        imagenUrl: producto.imagenUrl || null,
        estado: producto.estado || 'ACTIVADO',
      }),
    }),

  actualizar: (id, producto) =>
    solicitar(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        nombre: producto.nombre,
        marca: producto.marca,
        modelo: producto.modelo,
        precio: Number(producto.precio),
        categoriaId: Number(producto.categoriaId),
        descripcion: producto.descripcion,
        imagenUrl: producto.imagenUrl || null,
        estado: producto.estado || 'ACTIVADO',
      }),
    }),

  eliminar: (id) => solicitar(`/productos?id=/${id}`, { method: 'DELETE' }),
};