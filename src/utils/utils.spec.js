import { formatearCLP, formatearFecha } from './utils.js';

describe('Pruebas unitarias - Utils (GameHub Store)', () => {

  describe('formatearCLP()', () => {
    it('debe formatear un número válido como moneda chilena (CLP)', () => {
      const resultado = formatearCLP(15000);
      expect(resultado).toBe('$15.000');
    });

    it('debe aceptar valores que vengan como string numérico', () => {
      const resultado = formatearCLP('499990');
      expect(resultado).toBe('$499.990');
    });

    it('debe retornar "$0" si el valor entregado no es un número válido (NaN)', () => {
      expect(formatearCLP('texto_invalido')).toBe('$0');
      expect(formatearCLP(undefined)).toBe('$0');
      expect(formatearCLP(null)).toBe('$0');
    });

    it('debe formatear correctamente el valor 0', () => {
      expect(formatearCLP(0)).toBe('$0');
    });
  });

  describe('formatearFecha()', () => {
    it('debe formatear una fecha válida en formato chileno (DD/MM/AAAA)', () => {
      const fechaPrueba = '2025-05-10T12:00:00';
      const resultado = formatearFecha(fechaPrueba);
      expect(resultado).toBe('10-05-2025'); // O '10/5/2025' dependiendo del locale local
    });

    it('debe retornar la fecha actual si no se proporciona ninguna fecha', () => {
      const resultado = formatearFecha();
      const fechaActual = new Date().toLocaleDateString('es-CL');
      expect(resultado).toBe(fechaActual);
    });
  });

});