import { FiFilter, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';

export function FiltroCatalogo({
  filtros,
  onChangeFiltro,
  onLimpiarFiltros,
  categorias = [],
  marcas = [],
  errorRango = false
}) {
  return (
    <div className="cardGamer p-3 text-light rounded-3 border border-secondary bg-dark">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom border-secondary pb-2">
        <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
          <FiFilter className="text-info" /> Filtros
        </h5>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1"
          onClick={onLimpiarFiltros}
        >
          <FiRefreshCw size={12} /> Limpiar
        </button>
      </div>

      {/* Categoría */}
      <div className="mb-3">
        <label className="form-label small text-secondary">Categoría</label>
        <select
          className="form-select form-select-sm bg-dark text-light border-secondary"
          value={filtros.categoria}
          onChange={(e) => onChangeFiltro('categoria', e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Marca */}
      <div className="mb-3">
        <label className="form-label small text-secondary">Marca</label>
        <select
          className="form-select form-select-sm bg-dark text-light border-secondary"
          value={filtros.marca}
          onChange={(e) => onChangeFiltro('marca', e.target.value)}
        >
          <option value="">Todas las marcas</option>
          {marcas.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Rango de Precios */}
      <div className="mb-3">
        <label className="form-label small text-secondary">Rango de precio ($)</label>
        <div className="d-flex gap-2 align-items-center">
          <input
            type="number"
            className="form-control form-control-sm bg-dark text-light border-secondary"
            placeholder="Mín"
            value={filtros.precioMin}
            onChange={(e) => onChangeFiltro('precioMin', e.target.value)}
          />
          <span>-</span>
          <input
            type="number"
            className="form-control form-control-sm bg-dark text-light border-secondary"
            placeholder="Máx"
            value={filtros.precioMax}
            onChange={(e) => onChangeFiltro('precioMax', e.target.value)}
          />
        </div>
        {errorRango && (
          <div className="text-danger small mt-1 d-flex align-items-center gap-1">
            <FiAlertTriangle /> El mínimo no puede ser mayor al máximo.
          </div>
        )}
      </div>

      {/* Solo con Stock */}
      <div className="form-check form-switch mt-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="checkStock"
          checked={filtros.soloStock}
          onChange={(e) => onChangeFiltro('soloStock', e.target.checked)}
        />
        <label className="form-check-label small text-secondary" htmlFor="checkStock">
          Solo productos en stock
        </label>
      </div>
    </div>
  );
}

export default FiltroCatalogo;