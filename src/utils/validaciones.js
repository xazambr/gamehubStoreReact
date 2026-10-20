export const validarFormulario = (formulario = {}) => {
  const errores = {};

  if (!formulario.nombre || !formulario.nombre.trim()) {
    errores.nombre = "Ingresa tu nombre completo.";
  }

  if (!formulario.correo || !formulario.correo.trim()) {
    errores.correo = "Ingresa tu correo.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo.trim())) {
    errores.correo = "Ingresa un correo válido.";
  }

  const telefono = (formulario.telefono || "").replace(/[\s()-]/g, "");

  if (!telefono) {
    errores.telefono = "Ingresa tu teléfono.";
  } else if (!/^(?:\+?56)?9\d{8}$/.test(telefono)) {
    errores.telefono = "Ingresa un celular chileno válido.";
  }

  if (!formulario.region) {
    errores.region = "Selecciona una región.";
  }

  if (!formulario.comuna || !formulario.comuna.trim()) {
    errores.comuna = "Ingresa tu comuna.";
  }

  if (!formulario.direccion || !formulario.direccion.trim()) {
    errores.direccion = "Ingresa tu dirección.";
  }

  if (!formulario.metodoPago) {
    errores.metodoPago = "Selecciona un método de pago.";
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores,
  };
};

export const crearEstructuraOrden = (datosCliente, productos = [], total = 0) => {
  return {
    numero: `GH-${Date.now().toString().slice(-8)}`,
    fecha: new Date().toLocaleDateString("es-CL"),
    cliente: { ...datosCliente },
    productos: productos.map((prod) => ({ ...prod })),
    total,
    estadoPago: "Aprobado",
  }
};

export const guardarOrdenEnLocalStorage = (nuevaOrden) => {
  try {
    const ordenesGuardadas = JSON.parse(localStorage.getItem('gamehub_ordenes')) || [];
    localStorage.setItem('gamehub_ordenes', JSON.stringify([nuevaOrden, ...ordenesGuardadas]));
  } catch (err) {
    console.error("Error al guardar la orden en localStorage:", err);
  }
};