
export default function ConfirmacionCompra({ orden, formatoPrecio }) {
    return (
        <main className="checkout-confirmacion">
            <div className="checkout-exito" aria-hidden="true">
                ✓
            </div>

            <h1>¡Compra confirmada!</h1>

            <p>
                Gracias por comprar en <strong>GameHub Store</strong>,
                {" "}{orden.cliente.nombre}.
            </p>

            <div className="checkout-numero-orden">
                <span>Número de orden</span>
                <strong>{orden.numero}</strong>
            </div>

            <p>
                Total pagado:{" "}
                <strong>{formatoPrecio(orden.total)}</strong>
            </p>

            <p>
                Método de pago:{" "}
                {orden.cliente.metodoPago === "tarjeta"
                    ? "Tarjeta de crédito o débito"
                    : "Transferencia bancaria"}
            </p>

            <p>
                Estado del pago: <strong>{orden.estadoPago}</strong>
            </p>

            <p>
                Dirección de despacho: {orden.cliente.direccion},{" "}
                {orden.cliente.comuna}, {orden.cliente.region}.
            </p>

            <a href="/" className="checkout-boton checkout-enlace">
                Volver a la tienda
            </a>
        </main>
    );
}
