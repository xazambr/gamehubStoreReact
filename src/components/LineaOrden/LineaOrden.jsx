import { FiCheckCircle, FiClock, FiPackage } from 'react-icons/fi';
import './LineaOrden.css';

export function LineaOrden({ orden, formatearCLP }) {
  const {
    idOrden = '',
    fecha = '',
    estado = '',
    items = [],
    total = 0,
    metodoPago = ''
  } = orden || {};

  return (
    <div className="cardOrden">
      {/* Encabezado de la Orden */}
      <div className="d-flex flex-wrap justify-content-between align-items-center headerOrden">
        <div>
          <span className="text-secondary small d-block">Número de Orden</span>
          <span className="numOrden">{idOrden}</span>
        </div>

        <div className="text-end my-1">
          <span className="text-secondary small d-block">Fecha</span>
          <span className="small text-light fw-bold">{fecha}</span>
        </div>

        <div>
          {estado === 'Completado' ? (
            <span className="badgeCompletado">
              <FiCheckCircle /> Entregado
            </span>
          ) : (
            <span className="badgeProcesando">
              <FiClock /> {estado}
            </span>
          )}
        </div>
      </div>

      {/* Lista de Productos Comprados */}
      <div className="mb-3">
        {items.map((prod, index) => (
          <div key={prod.id || index} className="itemProducto">
            <img
              src={prod.imagen}
              alt={prod.nombre}
              className="imgMini"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/55/120E1A/00D2FF?text=GH";
              }}
            />
            <div className="flex-grow-1">
              <h6 className="mb-0 text-light fw-bold small">{prod.nombre}</h6>
              <span className="text-secondary small">
                {prod.marca} &bull; {prod.cantidad} unidad(es)
              </span>
            </div>
            <div className="text-end fw-bold text-light small">
              {formatearCLP((prod.precio || 0) * (prod.cantidad || 1))}
            </div>
          </div>
        ))}
      </div>

      {/* Pie de la Orden (Detalles de Pago y Total) */}
      <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
        <span className="text-secondary small d-flex align-items-center gap-1">
          <FiPackage /> Pago: <strong className="text-light">{metodoPago}</strong>
        </span>
        <div className="text-end">
          <span className="text-secondary small me-2">Total Pagado:</span>
          <span className="totalOrden">{formatearCLP(total)}</span>
        </div>
      </div>
    </div>
  );
}

export default LineaOrden;