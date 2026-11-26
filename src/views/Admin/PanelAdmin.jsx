import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { productosService } from '../../services/productosService';
import { categoriasService } from '../../services/categoriasService';
import { operacionService } from '../../services/operacionService';
import { formatearCLP } from '../../utils/utils';

const prodInicial = {
  id: null,
  nombre: '',
  marca: '',
  modelo: '',
  precio: '',
  categoriaId: '',
  descripcion: '',
  imagenUrl: '',
  estado: 'ACTIVADO',
};

const promoInicial = {
  codigo: '',
  descuentoPorcentaje: '',
  fechaInicio: '',
  fechaFin: '',
  topeUsos: 100,
};

export default function PanelAdmin() {
  const [tab, setTab] = useState('productos');
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [promociones, setPromociones] = useState([]);

  const [formProd, setFormProd] = useState(prodInicial);
  const [nuevaCat, setNuevaCat] = useState({ nombre: '', descripcion: '', estado: 'ACTIVADO' });
  const [formPromo, setFormPromo] = useState(promoInicial);

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  async function cargarTodo() {
    setCargando(true);
    setError(null);
    const [resProd, resCat, resPromo] = await Promise.allSettled([
      productosService.listar(),
      categoriasService.listar(),
      operacionService.listarPromociones(),
    ]);

    if (resProd.status === 'fulfilled') setProductos(resProd.value);
    if (resCat.status === 'fulfilled') setCategorias(Array.isArray(resCat.value) ? resCat.value : []);

    if (resPromo.status === 'fulfilled') {
      setPromociones(Array.isArray(resPromo.value) ? resPromo.value : []);
    } else {
      console.error('Error al listar promociones desde GET /promociones:', resPromo.reason);
    }

    setCargando(false);
  }

  useEffect(() => {
    cargarTodo();
  }, []);

  // --- CRUD PRODUCTOS ---
  async function guardarProducto(e) {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    if (Number(formProd.precio) <= 0) {
      setError('El precio debe ser mayor a cero.');
      return;
    }
    if (!formProd.categoriaId) {
      setError('Debes seleccionar una categoría válida.');
      return;
    }

    try {
      if (formProd.id) {
        await productosService.actualizar(formProd.id, formProd);
        setMensaje('Producto actualizado correctamente.');
      } else {
        await productosService.crear(formProd);
        setMensaje('Producto creado correctamente.');
      }
      setFormProd(prodInicial);
      cargarTodo();
    } catch (err) {
      setError(err.message || 'Error al guardar el producto.');
    }
  }

  async function eliminarProducto(id) {
    if (!window.confirm('¿Seguro que deseas eliminar este producto?')) return;
    try {
      await productosService.eliminar(id);
      setMensaje('Producto eliminado.');
      cargarTodo();
    } catch (err) {
      setError(err.message || 'No se pudo eliminar el producto.');
    }
  }

  // --- CREAR CATEGORÍA ---
  async function guardarCategoria(e) {
    e.preventDefault();
    setError(null);
    setMensaje(null);
    try {
      await categoriasService.crear(nuevaCat);
      setNuevaCat({ nombre: '', descripcion: '', estado: 'ACTIVADO' });
      setMensaje('Categoría creada correctamente.');
      cargarTodo();
    } catch (err) {
      setError(err.message || 'Error al crear la categoría.');
    }
  }

  // --- CREAR PROMOCIÓN ---
  async function guardarPromocion(e) {
    e.preventDefault();
    setError(null);
    setMensaje(null);

    if (formPromo.fechaFin < formPromo.fechaInicio) {
      setError('La fecha de término no puede ser anterior a la fecha de inicio.');
      return;
    }

    try {
      const creada = await operacionService.crearPromocion({
        ...formPromo,
        descuentoPorcentaje: Number(formPromo.descuentoPorcentaje),
        topeUsos: Number(formPromo.topeUsos),
      });

      // Si el backend devuelve la promoción creada, la reflejamos de inmediato en la tabla
      if (creada && typeof creada === 'object') {
        setPromociones((prev) => [creada, ...prev]);
      }

      setFormPromo(promoInicial);
      setMensaje('Promoción creada correctamente.');
      await cargarTodo();
    } catch (err) {
      setError(err.message || 'Error al crear la promoción.');
    }
  }

  return (
    <Layout>
      <main className="container-xl py-5 text-light">
        <h1 className="fs-3 mb-4">Panel de Administración</h1>

        <ul className="nav nav-pills mb-4 gap-2">
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'productos' ? 'active' : 'text-light'}`}
              onClick={() => setTab('productos')}
            >
              Productos
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'categorias' ? 'active' : 'text-light'}`}
              onClick={() => setTab('categorias')}
            >
              Categorías
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'promociones' ? 'active' : 'text-light'}`}
              onClick={() => setTab('promociones')}
            >
              Promociones
            </button>
          </li>
        </ul>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {cargando ? (
          <div className="alert alert-info">Cargando datos comerciales...</div>
        ) : (
          <>
            {/* TAB PRODUCTOS */}
            {tab === 'productos' && (
              <div className="row g-4">
                <div className="col-12 col-lg-4">
                  <form onSubmit={guardarProducto} className="card bg-dark text-light border-secondary p-3">
                    <h2 className="fs-5 mb-3">{formProd.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>

                    <div className="mb-2">
                      <label className="form-label">Nombre</label>
                      <input
                        className="form-control form-control-sm"
                        value={formProd.nombre}
                        onChange={(e) => setFormProd({ ...formProd, nombre: e.target.value })}
                        required
                      />
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label">Marca</label>
                        <input
                          className="form-control form-control-sm"
                          value={formProd.marca}
                          onChange={(e) => setFormProd({ ...formProd, marca: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Modelo</label>
                        <input
                          className="form-control form-control-sm"
                          value={formProd.modelo}
                          onChange={(e) => setFormProd({ ...formProd, modelo: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label">Precio (CLP)</label>
                        <input
                          type="number"
                          min="1"
                          className="form-control form-control-sm"
                          value={formProd.precio}
                          onChange={(e) => setFormProd({ ...formProd, precio: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Categoría</label>
                        <select
                          className="form-select form-select-sm"
                          value={formProd.categoriaId}
                          onChange={(e) => setFormProd({ ...formProd, categoriaId: e.target.value })}
                          required
                        >
                          <option value="">Seleccionar...</option>
                          {categorias.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-2">
                      <label className="form-label">URL de Imagen</label>
                      <input
                        type="url"
                        className="form-control form-control-sm"
                        placeholder="https://..."
                        value={formProd.imagenUrl}
                        onChange={(e) => setFormProd({ ...formProd, imagenUrl: e.target.value })}
                      />
                    </div>

                    <div className="mb-2">
                      <label className="form-label">Descripción</label>
                      <textarea
                        rows="2"
                        className="form-control form-control-sm"
                        value={formProd.descripcion}
                        onChange={(e) => setFormProd({ ...formProd, descripcion: e.target.value })}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Estado</label>
                      <select
                        className="form-select form-select-sm"
                        value={formProd.estado}
                        onChange={(e) => setFormProd({ ...formProd, estado: e.target.value })}
                      >
                        <option value="ACTIVADO">ACTIVADO</option>
                        <option value="DESACTIVADO">DESACTIVADO</option>
                      </select>
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-primary btn-sm flex-grow-1">
                        {formProd.id ? 'Actualizar' : 'Guardar Producto'}
                      </button>
                      {formProd.id && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => setFormProd(prodInicial)}
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="col-12 col-lg-8">
                  <div className="table-responsive">
                    <table className="table table-dark table-striped align-middle">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Producto</th>
                          <th>Categoría</th>
                          <th>Precio</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.map((p) => (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>
                              <div className="fw-bold">{p.nombre}</div>
                              <small className="text-secondary">{p.marca} - {p.modelo}</small>
                            </td>
                            <td>{p.categoria}</td>
                            <td>{formatearCLP(p.precio)}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <button
                                  className="btn btn-outline-info btn-sm"
                                  onClick={() =>
                                    setFormProd({
                                      id: p.id,
                                      nombre: p.nombre,
                                      marca: p.marca,
                                      modelo: p.modelo,
                                      precio: p.precio,
                                      categoriaId: p.categoriaId,
                                      descripcion: p.descripcion,
                                      imagenUrl: p.imagen,
                                      estado: p.estado || 'ACTIVADO',
                                    })
                                  }
                                >
                                  Editar
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => eliminarProducto(p.id)}
                                >
                                  Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CATEGORÍAS */}
            {tab === 'categorias' && (
              <div className="row g-4">
                <div className="col-12 col-md-4">
                  <form onSubmit={guardarCategoria} className="card bg-dark text-light border-secondary p-3">
                    <h2 className="fs-5 mb-3">Nueva Categoría</h2>
                    <div className="mb-2">
                      <label className="form-label">Nombre</label>
                      <input
                        className="form-control form-control-sm"
                        value={nuevaCat.nombre}
                        onChange={(e) => setNuevaCat({ ...nuevaCat, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Descripción</label>
                      <input
                        className="form-control form-control-sm"
                        value={nuevaCat.descripcion}
                        onChange={(e) => setNuevaCat({ ...nuevaCat, descripcion: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">Crear Categoría</button>
                  </form>
                </div>
                <div className="col-12 col-md-8">
                  <table className="table table-dark table-striped">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorias.map((c) => (
                        <tr key={c.id}>
                          <td>{c.id}</td>
                          <td>{c.nombre}</td>
                          <td>{c.descripcion}</td>
                          <td><span className="badge bg-success">{c.estado}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB PROMOCIONES */}
            {tab === 'promociones' && (
              <div className="row g-4">
                <div className="col-12 col-md-4">
                  <form onSubmit={guardarPromocion} className="card bg-dark text-light border-secondary p-3">
                    <h2 className="fs-5 mb-3">Nueva Promoción</h2>
                    <div className="mb-2">
                      <label className="form-label">Código Cupón</label>
                      <input
                        className="form-control form-control-sm text-uppercase"
                        placeholder="GAMER20"
                        value={formPromo.codigo}
                        onChange={(e) => setFormPromo({ ...formPromo, codigo: e.target.value.toUpperCase() })}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label">Descuento (%)</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        className="form-control form-control-sm"
                        value={formPromo.descuentoPorcentaje}
                        onChange={(e) => setFormPromo({ ...formPromo, descuentoPorcentaje: e.target.value })}
                        required
                      />
                    </div>
                    <div className="row g-2 mb-2">
                      <div className="col-6">
                        <label className="form-label">Inicio</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={formPromo.fechaInicio}
                          onChange={(e) => setFormPromo({ ...formPromo, fechaInicio: e.target.value })}
                          required
                        />
                      </div>
                      <div className="col-6">
                        <label className="form-label">Término</label>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={formPromo.fechaFin}
                          onChange={(e) => setFormPromo({ ...formPromo, fechaFin: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Tope de usos</label>
                      <input
                        type="number"
                        min="1"
                        className="form-control form-control-sm"
                        value={formPromo.topeUsos}
                        onChange={(e) => setFormPromo({ ...formPromo, topeUsos: e.target.value })}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-sm">Crear Cupón</button>
                  </form>
                </div>
                <div className="col-12 col-md-8">
                  <table className="table table-dark table-striped">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Descuento</th>
                        <th>Vigencia</th>
                        <th>Tope Usos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {promociones.map((pr, idx) => (
                        <tr key={pr.id ?? idx}>
                          <td className="fw-bold text-info">{pr.codigo}</td>
                          <td>{pr.porcentajeDescuento ?? pr.descuentoPorcentaje ?? pr.descuento}%</td>
                          <td>
                            {pr.fechaInicio
                              ? `${pr.fechaInicio.split('T')[0]} al ${(pr.fechaExpiracion ?? pr.fechaFin)?.split('T')[0]}`
                              : `Hasta ${(pr.fechaExpiracion ?? pr.fechaFin)?.split('T')[0] || 'Sin fecha'}`}
                          </td>
                          <td>{pr.topeDeUsos ?? pr.topeUsos ?? 'Ilimitado / BD'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </Layout>
  );
}