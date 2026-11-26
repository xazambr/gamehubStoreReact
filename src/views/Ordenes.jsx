import { useState, useEffect } from 'react';
import { LineaOrden } from '../components/LineaOrden/LineaOrden';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import Layout from "../components/Layout";
<<<<<<< HEAD
import { obtenerOrdenesGuardadas } from '../utils/ordenes';
import {formatearCLP} from '../utils/utils'

export default function Ordenes() {
    const [ordenes, setOrdenes] = useState([]);

    // Cargar órdenes guardadas al montar la vista
    useEffect(() => {
        const guardadas = obtenerOrdenesGuardadas();
        setOrdenes(guardadas);
    }, []);

    return (
        <Layout>
            <div className="py-5 text-light">
                <div className="container">

                    <Link to="/catalogo" className="text-info text-decoration-none small d-inline-flex align-items-center gap-1 mb-3">
                        <FiArrowLeft /> Volver al catálogo
                    </Link>

                    <p className="text-info fw-bold small text-uppercase mb-1" >
                        HISTORIAL DE COMPRAS
                    </p>
                    <h1 className="fw-extrabold mb-4 fs-2">MIS ÓRDENES</h1>

                    {ordenes.length === 0 ? (
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
                            {ordenes.map((ord, index) => (
                                <LineaOrden
                                    key={ord.numero || `orden-${index}`}
                                    orden={{
                                        idOrden: ord.numero || `GH-${index + 1}`,
                                        fecha: ord.fecha || 'Fecha desconocida',
                                        estado: ord.estado || ord.estadoPago || 'Completado',
                                        items: Array.isArray(ord.productos) ? ord.productos : [],
                                        total: Number(ord.total) || 0,
                                        metodoPago: ord.metodoPago || ord.cliente?.metodoPago || 'Tarjeta'
                                    }}
                                    formatearCLP={formatearCLP}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    );
=======
import { ordenesService } from '../services/ordenesService';
import { formatearCLP } from '../utils/utils';

export default function Ordenes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarOrdenes = async () => {
      try {
        const respuesta = await ordenesService.listar();

        // Soporta respuesta directa (array) o HATEOAS (_embedded)
        let lista = [];
        if (Array.isArray(respuesta)) {
          lista = respuesta;
        } else if (respuesta?._embedded) {
          const clave = Object.keys(respuesta._embedded)[0];
          lista = respuesta._embedded[clave] || [];
        }

        setOrdenes(lista);
      } catch (err) {
        console.error('Error al cargar órdenes:', err);
        setError(err.message || 'No se pudieron cargar las órdenes desde el servidor');
      } finally {
        setCargando(false);
      }
    };

    cargarOrdenes();
  }, []);

  return (
    <Layout>
      <div className="py-5 text-light">
        <div className="container">
          <Link to="/catalogo" className="text-info text-decoration-none small d-inline-flex align-items-center gap-1 mb-2">
            <FiArrowLeft /> Volver al catálogo
          </Link>

          <p className="text-info fw-bold small text-uppercase mb-1">
            HISTORIAL DE COMPRAS
          </p>
          <h1 className="fw-extrabold mb-4 fs-2">MIS ÓRDENES</h1>

          {cargando ? (
            <div className="text-center py-5">
              <p className="text-secondary">Cargando historial de órdenes...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : ordenes.length === 0 ? (
            <div className="text-center py-5 bg-dark rounded-3 border border-secondary">
              <FiShoppingBag size={50} className="text-secondary mb-3" />
              <h3 className="text-light">Aún no has realizado compras</h3>
              <p className="text-secondary mb-4">Tus pedidos confirmados aparecerán aquí</p>
              <Link to="/catalogo" className="btn btn-primary px-4 fw-bold">
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <div>
              {ordenes.map((ord, index) => (
                <LineaOrden
                  key={ord.id || `orden-${index}`}
                  orden={{
                    idOrden: ord.id ? `GH-${ord.id}` : `GH-${index + 1}`,
                    fecha: ord.fechaCreacion
                      ? new Date(ord.fechaCreacion).toLocaleDateString('es-CL')
                      : 'Fecha desconocida',
                    estado: ord.estado || 'creada',
                    items: Array.isArray(ord.juegosIds)
                      ? ord.juegosIds.map((juegoId) => ({
                          id: juegoId,
                          nombre: `Juego #${juegoId}`,
                          cantidad: 1,
                        }))
                      : [],
                    total: Number(ord.total) || 0,
                    metodoPago: ord.metodoPago || 'No especificado',
                  }}
                  formatearCLP={formatearCLP}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
>>>>>>> 8048c79 (Vista Mis ordenes funcionando)
}