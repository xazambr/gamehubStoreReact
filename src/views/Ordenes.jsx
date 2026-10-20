import { useState, useEffect } from 'react';
import { LineaOrden } from '../components/LineaOrden/LineaOrden';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import Layout from "../components/Layout";

export default function Ordenes() {

    const [ordenes, setOrdenes] = useState([]);

    // Cargar órdenes guardadas desde localStorage
    useEffect(() => {
        try {
            const guardadas = JSON.parse(localStorage.getItem('gamehub_ordenes')) || [];
            setOrdenes(guardadas);
        } catch (error) {
            console.error("Error al leer órdenes:", error);
        }
    }, []);

    return (
        <Layout>
            <div className="py-5 text-light" style={{ backgroundColor: '#120E1A', minHeight: 'calc(100vh - 80px)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>

                    <Link to="/catalogo" className="text-info text-decoration-none small d-inline-flex align-items-center gap-1 mb-3">
                        <FiArrowLeft /> Volver al catálogo
                    </Link>

                    <p className="text-info fw-bold small text-uppercase mb-1" style={{ letterSpacing: '2px' }}>
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
                            {ordenes.map((ord) => (
                                <LineaOrden
                                    key={ord.numero}
                                    orden={{
                                        idOrden: ord.numero,
                                        fecha: ord.fecha,
                                        estado: ord.estado || 'Completado',
                                        items: ord.productos,
                                        total: ord.total,
                                        metodoPago: ord.metodoPago
                                    }}
                                />
                            ))}
                        </div>
                    )}

                </div>
            </div>
        </Layout>
    )

}