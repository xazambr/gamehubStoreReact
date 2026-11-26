import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { operacionService } from '../../services/operacionService';
<<<<<<< HEAD
import { productosService } from '../../services/productosService';
import { inventarioService } from '../../services/inventarioService';
=======
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
import { formatearCLP } from '../../utils/utils';

export default function PanelOperador() {
  const [tab, setTab] = useState('ordenes');
  const [ordenes, setOrdenes] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [inventario, setInventario] = useState([]);
<<<<<<< HEAD
  const [productos, setProductos] = useState([]);
=======
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
  const [envios, setEnvios] = useState([]);

  const [trackingInput, setTrackingInput] = useState({});
  const [stockInput, setStockInput] = useState({});
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  async function cargarOperacion() {
    setCargando(true);
    setError(null);
<<<<<<< HEAD

    const [resOrd, resPag, resInv, resEnv, resProd] = await Promise.allSettled([
      operacionService.listarOrdenes(),
      operacionService.listarPagos(),
      inventarioService.listar(),
      operacionService.listarEnvios(),
      productosService.listar(),
    ]);

    if (resOrd.status === 'fulfilled') {
      setOrdenes(Array.isArray(resOrd.value) ? resOrd.value : []);
    }
    if (resPag.status === 'fulfilled') {
      setPagos(Array.isArray(resPag.value) ? resPag.value : []);
    }
    if (resInv.status === 'fulfilled') {
      setInventario(Array.isArray(resInv.value) ? resInv.value : []);
    } else {
      setError(
        `Error cargando inventario: ${resInv.reason?.message || 'Revisa puerto/seguridad de msvc-inventory'}`
      );
    }
    if (resEnv.status === 'fulfilled') {
      setEnvios(Array.isArray(resEnv.value) ? resEnv.value : []);
    }
    if (resProd.status === 'fulfilled') {
      setProductos(Array.isArray(resProd.value) ? resProd.value : []);
    }

=======
    const [resOrd, resPag, resInv, resEnv] = await Promise.allSettled([
      operacionService.listarOrdenes(),
      operacionService.listarPagos(),
      operacionService.listarInventario(),
      operacionService.listarEnvios(),
    ]);

    if (resOrd.status === 'fulfilled') setOrdenes(Array.isArray(resOrd.value) ? resOrd.value : []);
    if (resPag.status === 'fulfilled') setPagos(Array.isArray(resPag.value) ? resPag.value : []);
    if (resInv.status === 'fulfilled') setInventario(Array.isArray(resInv.value) ? resInv.value : []);
    if (resEnv.status === 'fulfilled') setEnvios(Array.isArray(resEnv.value) ? resEnv.value : []);
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
    setCargando(false);
  }

  useEffect(() => {
    cargarOperacion();
  }, []);

  // Confirmar o anular pago
  async function cambiarEstadoPago(pago, nuevoEstado) {
    setError(null);
    setMensaje(null);
    try {
      await operacionService.actualizarPago(pago.id, { ...pago, estado: nuevoEstado });
      setMensaje(`Pago #${pago.id} actualizado a ${nuevoEstado}.`);
<<<<<<< HEAD
      await cargarOperacion();
=======
      cargarOperacion();
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
    } catch (err) {
      setError(err.message || 'Error al actualizar el estado del pago.');
    }
  }

  // Generar despacho (Regla: solo si la orden tiene pago aprobado)
  async function despacharOrden(orden) {
    setError(null);
    setMensaje(null);

    const pagoAprobado = pagos.find(
<<<<<<< HEAD
      (p) =>
        (p.ordenId ?? p.orden?.id) === orden.id &&
        (p.estado ?? '').toUpperCase() === 'APROBADO'
=======
      (p) => (p.ordenId ?? p.orden?.id) === orden.id && (p.estado ?? '').toUpperCase() === 'APROBADO'
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
    );

    if (!pagoAprobado && (orden.estado ?? '').toUpperCase() !== 'PAGADA') {
      setError(`No se puede despachar la orden #${orden.id}: el pago aún no está aprobado.`);
      return;
    }

    const tracking = trackingInput[orden.id]?.trim();
    if (!tracking) {
      setError('Debes ingresar un número de seguimiento antes de despachar.');
      return;
    }

    try {
      await operacionService.crearEnvio({
        ordenId: orden.id,
        numeroSeguimiento: tracking,
        estado: 'EN_CAMINO',
      });
      setMensaje(`Despacho generado para la orden #${orden.id} (Tracking: ${tracking}).`);
<<<<<<< HEAD
      await cargarOperacion();
=======
      cargarOperacion();
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
    } catch (err) {
      setError(err.message || 'No se pudo generar el despacho.');
    }
  }

<<<<<<< HEAD
  // Crear (POST) o actualizar (PUT) stock disponible respetando validaciones de Inventario.java
  async function guardarNuevoStock(producto, invExistente) {
    setError(null);
    setMensaje(null);

    const valorCrudo = stockInput[producto.id];
    if (valorCrudo === undefined || valorCrudo === '') {
      setError('Ingresa una cantidad válida antes de guardar.');
      return;
    }

    const nuevoValor = Number(valorCrudo);
    if (Number.isNaN(nuevoValor) || nuevoValor < 0) {
      setError('El stock disponible no puede ser negativo.');
=======
  // Ajustar stock (Regla: el stock no puede quedar negativo)
  async function guardarNuevoStock(item) {
    setError(null);
    setMensaje(null);

    const nuevoValor = Number(stockInput[item.id]);
    if (Number.isNaN(nuevoValor) || nuevoValor < 0) {
      setError('El stock no puede ser negativo.');
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
      return;
    }

    try {
<<<<<<< HEAD
      if (invExistente?.id) {
        await inventarioService.actualizar(invExistente.id, invExistente, {
          stockDisponible: nuevoValor,
        });
      } else {
        await inventarioService.crear({
          productoId: producto.id,
          stockDisponible: nuevoValor,
          stockReservado: 0,
          stockMinimo: 5,
          ubicacion: 'Bodega Central',
        });
      }

      setStockInput((prev) => ({ ...prev, [producto.id]: '' }));
      setMensaje(`Stock de "${producto.nombre}" actualizado a ${nuevoValor} unidades.`);
      await cargarOperacion();
    } catch (err) {
      setError(err.message || 'Error al guardar el inventario.');
=======
      await operacionService.ajustarStock(item.id, {
        ...item,
        cantidad: nuevoValor,
        motivo: 'Ajuste manual desde Panel Operador',
      });
      setMensaje(`Stock actualizado a ${nuevoValor} unidades.`);
      cargarOperacion();
    } catch (err) {
      setError(err.message || 'Error al ajustar el inventario.');
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
    }
  }

  return (
    <Layout>
      <main className="container-xl py-5 text-light">
        <h1 className="fs-3 mb-4">Panel del Operador</h1>

        <ul className="nav nav-pills mb-4 gap-2">
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'ordenes' ? 'active' : 'text-light'}`}
              onClick={() => setTab('ordenes')}
            >
              Órdenes y Despachos
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'pagos' ? 'active' : 'text-light'}`}
              onClick={() => setTab('pagos')}
            >
              Pagos
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'inventario' ? 'active' : 'text-light'}`}
              onClick={() => setTab('inventario')}
            >
              Inventario / Stock
            </button>
          </li>
        </ul>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {cargando ? (
          <div className="alert alert-info">Cargando bandeja operativa...</div>
        ) : (
          <>
            {/* BANDEJA DE ÓRDENES Y DESPACHOS */}
            {tab === 'ordenes' && (
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Orden #</th>
                      <th>Total</th>
                      <th>Estado Orden</th>
                      <th>Seguimiento / Despacho</th>
                    </tr>
                  </thead>
                  <tbody>
<<<<<<< HEAD
                    {ordenes.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center text-secondary py-3">
                          No hay órdenes registradas.
                        </td>
                      </tr>
                    ) : (
                      ordenes.map((o) => {
                        const envioExistente = envios.find(
                          (e) => (e.ordenId ?? e.orden?.id) === o.id
                        );
                        return (
                          <tr key={o.id}>
                            <td className="fw-bold">#{o.id}</td>
                            <td>{formatearCLP(o.total ?? 0)}</td>
                            <td>
                              <span className="badge bg-info text-dark">
                                {o.estado || 'PENDIENTE'}
                              </span>
                            </td>
                            <td>
                              {envioExistente ? (
                                <span className="text-success">
                                  Despachado ({envioExistente.numeroSeguimiento} -{' '}
                                  {envioExistente.estado})
                                </span>
                              ) : (
                                <div className="d-flex gap-2" style={{ maxWidth: '340px' }}>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="N° Tracking (ej: GH-1029)"
                                    value={trackingInput[o.id] || ''}
                                    onChange={(e) =>
                                      setTrackingInput({
                                        ...trackingInput,
                                        [o.id]: e.target.value,
                                      })
                                    }
                                  />
                                  <button
                                    className="btn btn-primary btn-sm text-nowrap"
                                    onClick={() => despacharOrden(o)}
                                  >
                                    Despachar
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
=======
                    {ordenes.map((o) => {
                      const envioExistente = envios.find((e) => (e.ordenId ?? e.orden?.id) === o.id);
                      return (
                        <tr key={o.id}>
                          <td className="fw-bold">#{o.id}</td>
                          <td>{formatearCLP(o.total ?? 0)}</td>
                          <td>
                            <span className="badge bg-info text-dark">{o.estado || 'PENDIENTE'}</span>
                          </td>
                          <td>
                            {envioExistente ? (
                              <span className="text-success">
                                Despachado ({envioExistente.numeroSeguimiento} - {envioExistente.estado})
                              </span>
                            ) : (
                              <div className="d-flex gap-2" style={{ maxWidth: '340px' }}>
                                <input
                                  type="text"
                                  className="form-control form-control-sm"
                                  placeholder="N° Tracking (ej: GH-1029)"
                                  value={trackingInput[o.id] || ''}
                                  onChange={(e) =>
                                    setTrackingInput({ ...trackingInput, [o.id]: e.target.value })
                                  }
                                />
                                <button
                                  className="btn btn-primary btn-sm text-nowrap"
                                  onClick={() => despacharOrden(o)}
                                >
                                  Despachar
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
                  </tbody>
                </table>
              </div>
            )}

            {/* BANDEJA DE PAGOS */}
            {tab === 'pagos' && (
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Pago #</th>
                      <th>Orden #</th>
                      <th>Monto</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
<<<<<<< HEAD
                    {pagos.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-secondary py-3">
                          No hay pagos registrados.
                        </td>
                      </tr>
                    ) : (
                      pagos.map((p) => (
                        <tr key={p.id}>
                          <td>#{p.id}</td>
                          <td>#{p.ordenId ?? p.orden?.id}</td>
                          <td>{formatearCLP(p.monto ?? 0)}</td>
                          <td>
                            <span
                              className={`badge ${
                                p.estado === 'APROBADO'
                                  ? 'bg-success'
                                  : p.estado === 'ANULADO'
                                  ? 'bg-danger'
                                  : 'bg-warning text-dark'
                              }`}
                            >
                              {p.estado}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => cambiarEstadoPago(p, 'APROBADO')}
                              >
                                Aprobar
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => cambiarEstadoPago(p, 'ANULADO')}
                              >
                                Anular
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
=======
                    {pagos.map((p) => (
                      <tr key={p.id}>
                        <td>#{p.id}</td>
                        <td>#{p.ordenId ?? p.orden?.id}</td>
                        <td>{formatearCLP(p.monto ?? 0)}</td>
                        <td>
                          <span
                            className={`badge ${
                              p.estado === 'APROBADO'
                                ? 'bg-success'
                                : p.estado === 'ANULADO'
                                ? 'bg-danger'
                                : 'bg-warning text-dark'
                            }`}
                          >
                            {p.estado}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => cambiarEstadoPago(p, 'APROBADO')}
                            >
                              Aprobar
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => cambiarEstadoPago(p, 'ANULADO')}
                            >
                              Anular
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
                  </tbody>
                </table>
              </div>
            )}

<<<<<<< HEAD
            {/* INVENTARIO / STOCK */}
=======
            {/* AJUSTE DE STOCK */}
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
            {tab === 'inventario' && (
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
<<<<<<< HEAD
                      <th>Inv. #</th>
                      <th>Producto</th>
                      <th>Ubicación</th>
                      <th>Disponible</th>
                      <th>Reservado</th>
                      <th>Mínimo</th>
                      <th>Nuevo Disponible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-secondary py-3">
                          No hay productos activos en el catálogo.
                        </td>
                      </tr>
                    ) : (
                      productos.map((prod) => {
                        const inv = inventario.find(
                          (item) => Number(item.productoId) === Number(prod.id)
                        );
                        const disponible = inv ? (inv.stockDisponible ?? 0) : 0;
                        const bajoMinimo = inv
                          ? disponible <= (inv.stockMinimo ?? 0)
                          : true;

                        return (
                          <tr key={prod.id}>
                            <td>
                              {inv ? (
                                `#${inv.id}`
                              ) : (
                                <span className="badge bg-secondary">Sin registro</span>
                              )}
                            </td>
                            <td>
                              <div className="fw-bold">{prod.nombre}</div>
                              <small className="text-secondary">
                                ID #{prod.id} · {prod.marca} {prod.modelo}
                              </small>
                            </td>
                            <td>{inv?.ubicacion || 'Bodega Central'}</td>
                            <td>
                              <span
                                className={`fw-bold ${
                                  bajoMinimo ? 'text-danger' : 'text-success'
                                }`}
                              >
                                {disponible} un.
                              </span>
                            </td>
                            <td>{inv?.stockReservado ?? 0} un.</td>
                            <td>{inv?.stockMinimo ?? 5} un.</td>
                            <td>
                              <div className="d-flex gap-2" style={{ maxWidth: '230px' }}>
                                <input
                                  type="number"
                                  min="0"
                                  className="form-control form-control-sm"
                                  placeholder={String(disponible)}
                                  value={stockInput[prod.id] ?? ''}
                                  onChange={(e) =>
                                    setStockInput({
                                      ...stockInput,
                                      [prod.id]: e.target.value,
                                    })
                                  }
                                />
                                <button
                                  className="btn btn-warning btn-sm"
                                  onClick={() => guardarNuevoStock(prod, inv)}
                                >
                                  {inv ? 'Ajustar' : 'Crear'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
=======
                      <th>ID Inv.</th>
                      <th>Producto ID</th>
                      <th>Stock Actual</th>
                      <th>Nuevo Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventario.map((inv) => (
                      <tr key={inv.id}>
                        <td>{inv.id}</td>
                        <td>Producto #{inv.productoId ?? inv.producto?.id}</td>
                        <td className="fw-bold">{inv.cantidad ?? inv.stock ?? 0} un.</td>
                        <td>
                          <div className="d-flex gap-2" style={{ maxWidth: '220px' }}>
                            <input
                              type="number"
                              min="0"
                              className="form-control form-control-sm"
                              placeholder="Cantidad"
                              value={stockInput[inv.id] ?? ''}
                              onChange={(e) =>
                                setStockInput({ ...stockInput, [inv.id]: e.target.value })
                              }
                            />
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => guardarNuevoStock(inv)}
                            >
                              Ajustar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </main>
    </Layout>
  );
}