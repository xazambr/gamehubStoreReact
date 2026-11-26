import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { operacionService } from '../../services/operacionService';
import { productosService } from '../../services/productosService';
import { inventarioService } from '../../services/inventarioService';
import { formatearCLP } from '../../utils/utils';

export default function PanelOperador() {
  const [tab, setTab] = useState('ordenes');
  const [ordenes, setOrdenes] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [productos, setProductos] = useState([]);
  const [envios, setEnvios] = useState([]);

  const [trackingInput, setTrackingInput] = useState({});
  const [empresaInput, setEmpresaInput] = useState({});
  const [stockInput, setStockInput] = useState({});
  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  async function cargarOperacion() {
    setCargando(true);
    setError(null);

    const [resOrd, resPag, resInv, resEnv, resProd] = await Promise.allSettled([
      operacionService.listarOrdenes(),
      operacionService.listarPagos(),
      inventarioService.listar(),
      operacionService.listarEnvios(),
      productosService.listar(),
    ]);

    const erroresCarga = [];

    if (resOrd.status === 'fulfilled') {
      setOrdenes(Array.isArray(resOrd.value) ? resOrd.value : []);
    } else {
      erroresCarga.push(`Órdenes: ${resOrd.reason?.message || 'Error al consultar /orden'}`);
    }

    if (resPag.status === 'fulfilled') {
      setPagos(Array.isArray(resPag.value) ? resPag.value : []);
    } else {
      erroresCarga.push(`Pagos: ${resPag.reason?.message || 'Error al consultar /pago'}`);
    }

    if (resInv.status === 'fulfilled') {
      setInventario(Array.isArray(resInv.value) ? resInv.value : []);
    } else {
      erroresCarga.push(`Inventario: ${resInv.reason?.message || 'Error al consultar /inventario'}`);
    }

    if (resEnv.status === 'fulfilled') {
      setEnvios(Array.isArray(resEnv.value) ? resEnv.value : []);
    }

    if (resProd.status === 'fulfilled') {
      setProductos(Array.isArray(resProd.value) ? resProd.value : []);
    }

    if (erroresCarga.length > 0) {
      setError(erroresCarga.join(' | '));
    }

    setCargando(false);
  }

  useEffect(() => {
    cargarOperacion();
  }, []);

  // Aprobar o anular pago en msvc-payments y sincronizar estado de la orden
  async function cambiarEstadoPago(pago, nuevoEstado) {
    setError(null);
    setMensaje(null);
    setProcesandoId(`pago-${pago.id}`);

    try {
      await operacionService.actualizarPago(pago.id, pago, nuevoEstado);

      const ordenId = pago.ordenId ?? pago.orden?.id;
      if (ordenId) {
        const estadoOrdenDestino = nuevoEstado === 'APROBADO' ? 'PAGADA' : 'CANCELADA';
        await operacionService.actualizarEstadoOrden(ordenId, estadoOrdenDestino).catch(() => null);
      }

      setMensaje(`Pago #${pago.id} marcado como ${nuevoEstado}.`);
      await cargarOperacion();
    } catch (err) {
      setError(err.message || `No se pudo actualizar el pago #${pago.id}.`);
    } finally {
      setProcesandoId(null);
    }
  }

  // Cambiar manualmente el estado de la orden en msvc-orders
  async function cambiarEstadoOrdenDirecto(ordenId, nuevoEstado) {
    setError(null);
    setMensaje(null);
    setProcesandoId(`estado-ord-${ordenId}`);

    try {
      await operacionService.actualizarEstadoOrden(ordenId, nuevoEstado);
      setMensaje(`Estado de la orden #${ordenId} actualizado a ${nuevoEstado}.`);
      await cargarOperacion();
    } catch (err) {
      setError(err.message || `No se pudo cambiar el estado de la orden #${ordenId}.`);
    } finally {
      setProcesandoId(null);
    }
  }

  // Cambiar el estado del envío en msvc-shipping (y marcar orden como ENTREGADA si corresponde)
  async function cambiarEstadoEnvioDirecto(envio, ordenId, nuevoEstadoEnvio) {
    setError(null);
    setMensaje(null);
    setProcesandoId(`envio-${envio.id}`);

    try {
      await operacionService.actualizarEnvio(envio.id, nuevoEstadoEnvio);

      if (nuevoEstadoEnvio === 'ENTREGADO' && ordenId) {
        await operacionService.actualizarEstadoOrden(ordenId, 'ENTREGADA').catch(() => null);
      }

      setMensaje(`Envío #${envio.id} actualizado a ${nuevoEstadoEnvio}.`);
      await cargarOperacion();
    } catch (err) {
      setError(err.message || `No se pudo actualizar el envío #${envio.id}.`);
    } finally {
      setProcesandoId(null);
    }
  }

  // Generar despacho en msvc-shipping y actualizar orden a DESPACHADA
  async function despacharOrden(orden) {
    setError(null);
    setMensaje(null);

    const ordenId = orden.id ?? orden.ordenId;
    const pagoAsociado = pagos.find(
      (p) => Number(p.ordenId ?? p.orden?.id) === Number(ordenId)
    );
    const estadoPago = (pagoAsociado?.estado ?? '').toUpperCase();
    const estadoOrden = (orden.estado ?? '').toUpperCase();

    if (estadoPago !== 'APROBADO' && estadoOrden !== 'PAGADA' && estadoOrden !== 'COMPLETADA') {
      setError(
        `No se puede despachar la orden #${ordenId}: primero debes aprobar su pago en la pestaña Pagos.`
      );
      return;
    }

    const tracking = trackingInput[ordenId]?.trim();
    if (!tracking) {
      setError('Debes ingresar un número de seguimiento antes de despachar.');
      return;
    }

    const empresaTransporte = empresaInput[ordenId] || 'Chilexpress';

    setProcesandoId(`orden-${ordenId}`);
    try {
      await operacionService.crearEnvio({
        ordenId: Number(ordenId),
        direccionDestino: orden.direccionEnvio || orden.direccionDestino || 'Despacho estándar',
        empresaTransporte,
        numeroSeguimiento: tracking,
      });

      await operacionService.actualizarEstadoOrden(ordenId, 'DESPACHADA').catch(() => null);

      setTrackingInput((prev) => ({ ...prev, [ordenId]: '' }));
      setMensaje(
        `Despacho generado para la orden #${ordenId} vía ${empresaTransporte}.`
      );
      await cargarOperacion();
    } catch (err) {
      setError(err.message || 'No se pudo generar el despacho.');
    } finally {
      setProcesandoId(null);
    }
  }

  // Crear o ajustar stock disponible en msvc-inventory
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
      return;
    }

    setProcesandoId(`stock-${producto.id}`);
    try {
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
    } finally {
      setProcesandoId(null);
    }
  }

  return (
    <Layout>
      <main className="container-xl py-5 text-light">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="fs-3 mb-0">Panel del Operador</h1>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={cargarOperacion}
            disabled={cargando}
          >
            Actualizar datos
          </button>
        </div>

        <ul className="nav nav-pills mb-4 gap-2">
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'ordenes' ? 'active' : 'text-light'}`}
              onClick={() => setTab('ordenes')}
            >
              Órdenes y Despachos ({ordenes.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'pagos' ? 'active' : 'text-light'}`}
              onClick={() => setTab('pagos')}
            >
              Pagos ({pagos.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${tab === 'inventario' ? 'active' : 'text-light'}`}
              onClick={() => setTab('inventario')}
            >
              Inventario / Stock ({productos.length})
            </button>
          </li>
        </ul>

        {mensaje && <div className="alert alert-success">{mensaje}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {cargando ? (
          <div className="alert alert-info">Cargando bandeja operativa...</div>
        ) : (
          <>
            {/* 1. BANDEJA DE ÓRDENES Y DESPACHOS */}
            {tab === 'ordenes' && (
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Orden #</th>
                      <th>Cliente / Dirección</th>
                      <th>Total</th>
                      <th>Pago</th>
                      <th>Estado Orden</th>
                      <th>Transporte y Seguimiento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordenes.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-secondary py-4">
                          No hay órdenes registradas.
                        </td>
                      </tr>
                    ) : (
                      ordenes.map((o) => {
                        const ordenId = o.id ?? o.ordenId;
                        const pagoAsociado = pagos.find(
                          (p) => Number(p.ordenId ?? p.orden?.id) === Number(ordenId)
                        );
                        const envioExistente = envios.find(
                          (e) => Number(e.ordenId ?? e.orden?.id) === Number(ordenId)
                        );
                        const estadoPago = (pagoAsociado?.estado || 'SIN PAGO').toUpperCase();

                        return (
                          <tr key={ordenId}>
                            <td className="fw-bold">#{ordenId}</td>
                            <td>
                              <div>{o.username || `Usuario #${o.usuarioId ?? '-'}`}</div>
                              <small className="text-secondary">
                                {o.direccionEnvio || o.direccionDestino || 'Sin dirección especificada'}
                              </small>
                            </td>
                            <td>{formatearCLP(o.total ?? o.montoTotal ?? 0)}</td>
                            <td>
                              <span
                                className={`badge ${
                                  estadoPago === 'APROBADO'
                                    ? 'bg-success'
                                    : estadoPago === 'ANULADO'
                                    ? 'bg-danger'
                                    : 'bg-warning text-dark'
                                }`}
                              >
                                {estadoPago}
                              </span>
                            </td>
                            <td>
                              <select
                                className="form-select form-select-sm bg-dark text-light border-secondary"
                                style={{ maxWidth: '145px' }}
                                value={o.estado || 'creada'}
                                disabled={procesandoId === `estado-ord-${ordenId}`}
                                onChange={(e) =>
                                  cambiarEstadoOrdenDirecto(ordenId, e.target.value)
                                }
                              >
                                <option value="creada">creada</option>
                                <option value="PAGADA">PAGADA</option>
                                <option value="DESPACHADA">DESPACHADA</option>
                                <option value="ENTREGADA">ENTREGADA</option>
                                <option value="CANCELADA">CANCELADA</option>
                              </select>
                            </td>
                            <td>
                              {envioExistente ? (
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                  <span className="text-success fw-semibold">
                                    {envioExistente.empresaTransporte || 'Courier'} ·{' '}
                                    {envioExistente.numeroSeguimiento}
                                  </span>
                                  <select
                                    className="form-select form-select-sm bg-dark text-light border-success"
                                    style={{ maxWidth: '140px' }}
                                    value={envioExistente.estadoEnvio || 'PENDIENTE'}
                                    disabled={procesandoId === `envio-${envioExistente.id}`}
                                    onChange={(e) =>
                                      cambiarEstadoEnvioDirecto(
                                        envioExistente,
                                        ordenId,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="EN_CAMINO">EN_CAMINO</option>
                                    <option value="ENTREGADO">ENTREGADO</option>
                                  </select>
                                </div>
                              ) : (
                                <div className="d-flex gap-2" style={{ maxWidth: '440px' }}>
                                  <select
                                    className="form-select form-select-sm"
                                    style={{ maxWidth: '140px' }}
                                    value={empresaInput[ordenId] || 'Chilexpress'}
                                    onChange={(e) =>
                                      setEmpresaInput({
                                        ...empresaInput,
                                        [ordenId]: e.target.value,
                                      })
                                    }
                                  >
                                    <option value="Chilexpress">Chilexpress</option>
                                    <option value="Starken">Starken</option>
                                    <option value="Blue Express">Blue Express</option>
                                    <option value="Correos de Chile">Correos de Chile</option>
                                  </select>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="N° Tracking (ej: GH-1029)"
                                    value={trackingInput[ordenId] || ''}
                                    onChange={(e) =>
                                      setTrackingInput({
                                        ...trackingInput,
                                        [ordenId]: e.target.value,
                                      })
                                    }
                                  />
                                  <button
                                    className="btn btn-primary btn-sm text-nowrap"
                                    disabled={procesandoId === `orden-${ordenId}`}
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
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. BANDEJA DE PAGOS */}
            {tab === 'pagos' && (
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
                      <th>Pago #</th>
                      <th>Orden #</th>
                      <th>Método</th>
                      <th>Monto</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagos.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-secondary py-4">
                          No hay pagos registrados.
                        </td>
                      </tr>
                    ) : (
                      pagos.map((p) => {
                        const estadoActual = (p.estado || 'PENDIENTE').toUpperCase();
                        const cargandoFila = procesandoId === `pago-${p.id}`;

                        return (
                          <tr key={p.id}>
                            <td className="fw-bold">#{p.id}</td>
                            <td>#{p.ordenId ?? p.orden?.id ?? '-'}</td>
                            <td>{p.metodoPago || 'TARJETA'}</td>
                            <td>{formatearCLP(p.monto ?? 0)}</td>
                            <td>
                              <span
                                className={`badge ${
                                  estadoActual === 'APROBADO'
                                    ? 'bg-success'
                                    : estadoActual === 'ANULADO'
                                    ? 'bg-danger'
                                    : 'bg-warning text-dark'
                                }`}
                              >
                                {estadoActual}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-success btn-sm"
                                  disabled={cargandoFila || estadoActual === 'APROBADO'}
                                  onClick={() => cambiarEstadoPago(p, 'APROBADO')}
                                >
                                  Aprobar
                                </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  disabled={cargandoFila || estadoActual === 'ANULADO'}
                                  onClick={() => cambiarEstadoPago(p, 'ANULADO')}
                                >
                                  Anular
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 3. INVENTARIO / STOCK */}
            {tab === 'inventario' && (
              <div className="table-responsive">
                <table className="table table-dark table-striped align-middle">
                  <thead>
                    <tr>
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
                        <td colSpan="7" className="text-center text-secondary py-4">
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
                                  disabled={procesandoId === `stock-${prod.id}`}
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