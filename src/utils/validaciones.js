export const validarFormularioCheckout = (formulario) => {
  const nuevosErrores = {};

  if (!formulario.nombre || !formulario.nombre.trim()) {
    nuevosErrores.nombre = "Ingresa tu nombre completo.";
  }

  if (!formulario.correo || !formulario.correo.trim()) {
    nuevosErrores.correo = "Ingresa tu correo.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo.trim())) {
    nuevosErrores.correo = "Ingresa un correo válido.";
  }

  const telefono = (formulario.telefono || "").replace(/[\s()-]/g, "");

  if (!telefono) {
    nuevosErrores.telefono = "Ingresa tu teléfono.";
  } else if (!/^(?:\+?56)?9\d{8}$/.test(telefono)) {
    nuevosErrores.telefono = "Ingresa un celular chileno válido.";
  }

  if (!formulario.region) {
    nuevosErrores.region = "Selecciona una región.";
  }

  if (!formulario.comuna || !formulario.comuna.trim()) {
    nuevosErrores.comuna = "Ingresa tu comuna.";
  }

  if (!formulario.direccion || !formulario.direccion.trim()) {
    nuevosErrores.direccion = "Ingresa tu dirección.";
  }

  if (!formulario.metodoPago) {
    nuevosErrores.metodoPago = "Selecciona un método de pago.";
  }

  return {
    esValido: Object.keys(nuevosErrores).length === 0,
    errores: nuevosErrores
  };
};