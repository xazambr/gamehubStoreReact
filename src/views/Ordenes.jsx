import { useState, useEffect } from 'react';
import { LineaOrden } from '../components/LineaOrden/LineaOrden';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import Layout from '../components/Layout';
import { useAuth } from '../auth/useAuth';
import { ordenesService } from '../services/ordenesService';
import { operacionService } from '../services/operacionService';
import { productosService } from '../services/productosService';
import { formatearCLP } from '../utils/utils';

export default function Ordenes() {
  const { usuario } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [envios, setEnvios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function cargarMisOrdenes() {
      if (!usuario) return;
      setCargando(true);
      setError(null);

      const [resOrd, resPag, resEnv, resProd] = await Promise.allSettled([
        ordenesService.listarPorCliente(usuario),
        operacionService.listarPagos(),
        operacionService.listarEnvios(),
        productosService.listar(),
      ]);

      if (resOrd.status === 'fulfilled') {
        const lista = Array.isArray(resOrd.value) ? resOrd.value : [];
        lista.sort((a, b) => Number(b.id ?? 0) - Number(a.id ?? 0));
        setOrdenes(lista);
      } else {
        setError(resOrd.reason?.message || 'Error al cargar tus órdenes desde el servidor.');
      }

      if (resPag.status === 'fulfilled') {
        setPagos(Array.isArray(resPag.value) ? resPag.value : []);
      }

      if (resEnv.status === 'fulfilled') {
        setEnvios(Array.isArray(resEnv.value) ? resEnv.value : []);
      }

      if (resProd.status === 'fulfilled') {
        setProductos(Array.isArray(resProd.value) ? resProd.value : []);
      }

      setCargando(false);
    }

    cargarMisOrdenes();
  }, [usuario]);

  function construirItems(juegosIds) {
    if (!Array.isArray(juegosIds) || juegosIds.length === 0) return [];

    const conteo = {};
    juegosIds.forEach((id) => {
      const numId = Number(id);
      conteo[numId] = (conteo[numId] || 0) + 1;
    });

    return Object.entries(conteo).map(([idStr, cantidad]) => {
      const prod = productos.find((p) => Number(p.id) === Number(idStr));
      return {
        id: Number(idStr),
        nombre: prod?.nombre || `Juego #${idStr}`,
        cantidad,
        precio: prod?.precio ?? 0,
      };
    });
  }

  return (
    <Layout>
      <div className="py-5 text-light">
        <div className="container">
          <Link
            to="/catalogo"
            className="text-info text-decoration-none small d-inline-flex align-items-center gap-1 mb-3"
          >
            <FiArrowLeft /> Volver al catálogo
          </Link>

          <p className="text-info fw-bold small text-uppercase mb-1">
            HISTORIAL DE COMPRAS
          </p>
          <h1 className="fw-extrabold mb-4 fs-2">MIS ÓRDENES</h1>

          {error && <div className="alert alert-danger">{error}</div>}

          {cargando ? (
            <div className="alert alert-info">Cargando tus órdenes...</div>
          ) : ordenes.length === 0 ? (
            <div className="text-center py-5 bg-dark rounded-3 border border-secondary p-4">
              <FiShoppingBag size={50} className="text-secondary mb-3" />
              <h3 className="text-light">Aún no has realizado compras</h3>
              <p className="text-secondary mb-4">Tus pedidos confirmados aparecerán aquí.</p>
              <Link to="/catalogo" className="btn btn-primary px-4 fw-bold">
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <div>
              {ordenes.map((ord, index) => {
                const pago = pagos.find((p) => Number(p.ordenId) === Number(ord.id));
                const envio = envios.find((e) => Number(e.ordenId) === Number(ord.id));

                const estadoOrden = (ord.estado || 'creada').toUpperCase();
                const estadoConsolidado = envio
                  ? `${envio.estado || 'EN_CAMINO'} · ${envio.empresaTransporte || 'Courier'} (${
                      envio.numeroSeguimiento || envio.codigoSeguimiento
                    })`
                  : pago?.estado
                  ? `${estadoOrden} · Pago: ${pago.estado}`
                  : estadoOrden;

                return (
                  <LineaOrden
                    key={ord.id || `orden-${index}`}
                    orden={{
                      idOrden: ord.id ? `GH-${ord.id}` : `GH-${index + 1}`,
                      fecha: ord.fechaCreacion
                        ? new Date(ord.fechaCreacion).toLocaleDateString('es-CL')
                        : 'Reciente',
                      estado: estadoConsolidado,
                      items: construirItems(ord.juegosIds),
                      total: Number(ord.total) || 0,
                      metodoPago: ord.metodoPago || pago?.metodoPago || 'Tarjeta',
                    }}
                    formatearCLP={formatearCLP}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}