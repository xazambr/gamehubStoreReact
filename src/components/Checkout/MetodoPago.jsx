export default function MetodoPago({
  metodoPago,
  manejarCambio,
  error,
}) {
  return (
    <section className="checkout-panel">
      <h2>02. Método de pago</h2>

      <fieldset className="checkout-pagos">
        <legend>Selecciona cómo pagar</legend>

        <label className="checkout-opcion">
          <input
            type="radio"
            name="metodoPago"
            value="tarjeta"
            checked={metodoPago === "tarjeta"}
            onChange={manejarCambio}
          />
          <span>
            <strong>Tarjeta de crédito o débito</strong>
            <small>Pago de demostración</small>
          </span>
        </label>

        <label className="checkout-opcion">
          <input
            type="radio"
            name="metodoPago"
            value="transferencia"
            checked={metodoPago === "transferencia"}
            onChange={manejarCambio}
          />
          <span>
            <strong>Transferencia bancaria</strong>
            <small>Pago de demostración</small>
          </span>
        </label>

        {error && (
          <small className="checkout-error">{error}</small>
        )}
      </fieldset>
    </section>
  );
}
