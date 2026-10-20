export default function ResumenOrden({
  carrito,
  total,
  formatoPrecio,
  onConfirmar,
}) {
  return (
    <aside className="checkout-panel checkout-resumen">
      <h2>Resumen de tu orden</h2>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <ul className="checkout-lista">
          {carrito.map((producto) => (
            <li key={producto.id} className="checkout-producto">
              <div>
                <strong>{producto.nombre}</strong>
                <p>Cantidad: {producto.cantidad}</p>
              </div>

              <span>
                {formatoPrecio(
                  Number(producto.precio) * Number(producto.cantidad)
                )}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="checkout-total">
        <span>Subtotal</span>
        <strong>{formatoPrecio(total)}</strong>
      </div>

      <p className="checkout-nota">
        Los costos de despacho no están incluidos en este subtotal.
      </p>

      <button
        type="submit"
        className="checkout-boton"
        onClick={onConfirmar}
        disabled={carrito.length === 0}
      >
        Confirmar compra
      </button>
    </aside>
  );
}
