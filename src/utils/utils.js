export const formatearCLP = (monto) => {
  const num = Number(monto);
  if (isNaN(num)) return '$0';
  return `$${num.toLocaleString('es-CL')}`;
};

export const formatearFecha = (fecha = new Date()) => {
  return new Date(fecha).toLocaleDateString('es-CL');
};