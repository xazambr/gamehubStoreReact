export default function FormularioDespacho({
  formulario,
  errores,
  manejarCambio,
}) {
  return (
    <section className="checkout-panel">
      <h2>01. Datos de despacho</h2>

      <div className="checkout-campo">
        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          value={formulario.nombre}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.nombre)}
          required
        />
        {errores.nombre && (
          <small className="checkout-error">{errores.nombre}</small>
        )}
      </div>

      <div className="checkout-campo">
        <label htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          placeholder="jugador@correo.cl"
          value={formulario.correo}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.correo)}
          required
        />
        {errores.correo && (
          <small className="checkout-error">{errores.correo}</small>
        )}
      </div>

      <div className="checkout-campo">
        <label htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          placeholder="912345678"
          value={formulario.telefono}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.telefono)}
          required
        />
        {errores.telefono && (
          <small className="checkout-error">{errores.telefono}</small>
        )}
      </div>

      <div className="checkout-campo">
        <label htmlFor="region">Región</label>
        <select
          id="region"
          name="region"
          autoComplete="address-level1"
          value={formulario.region}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.region)}
          required
        >
          <option value="">Selecciona una región</option>
          <option value="Arica y Parinacota">Arica y Parinacota</option>
          <option value="Tarapacá">Tarapacá</option>
          <option value="Antofagasta">Antofagasta</option>
          <option value="Atacama">Atacama</option>
          <option value="Coquimbo">Coquimbo</option>
          <option value="Valparaíso">Valparaíso</option>
          <option value="Metropolitana de Santiago">
            Metropolitana de Santiago
          </option>
          <option value="O'Higgins">O'Higgins</option>
          <option value="Maule">Maule</option>
          <option value="Ñuble">Ñuble</option>
          <option value="Biobío">Biobío</option>
          <option value="La Araucanía">La Araucanía</option>
          <option value="Los Ríos">Los Ríos</option>
          <option value="Los Lagos">Los Lagos</option>
          <option value="Aysén">Aysén</option>
          <option value="Magallanes">Magallanes</option>
        </select>
        {errores.region && (
          <small className="checkout-error">{errores.region}</small>
        )}
      </div>

      <div className="checkout-campo">
        <label htmlFor="comuna">Comuna</label>
        <input
          id="comuna"
          name="comuna"
          type="text"
          autoComplete="address-level2"
          value={formulario.comuna}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.comuna)}
          required
        />
        {errores.comuna && (
          <small className="checkout-error">{errores.comuna}</small>
        )}
      </div>

      <div className="checkout-campo">
        <label htmlFor="direccion">Dirección de despacho</label>
        <input
          id="direccion"
          name="direccion"
          type="text"
          autoComplete="street-address"
          placeholder="Calle, número y departamento"
          value={formulario.direccion}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.direccion)}
          required
        />
        {errores.direccion && (
          <small className="checkout-error">{errores.direccion}</small>
        )}
      </div>
    </section>
  );
}
