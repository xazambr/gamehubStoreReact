import { obtenerOrdenesGuardadas } from './ordenes.js';

describe('Pruebas unitarias - Historial de Órdenes (GameHub Store)', () => {

  beforeEach(() => {
    localStorage.clear();
  });

  describe('obtenerOrdenesGuardadas()', () => {

    it('debe retornar un arreglo vacío si no hay órdenes en localStorage', () => {
      const resultado = obtenerOrdenesGuardadas();
      
      expect(Array.isArray(resultado)).toBe(true);
      expect(resultado.length).toBe(0);
    });

    it('debe retornar las órdenes guardadas cuando el contenido en localStorage es un JSON válido con un arreglo', () => {
      const ordenesMock = [
        { numero: 'GH-1001', total: 499990, estadoPago: 'Aprobado' },
        { numero: 'GH-1002', total: 25000, estadoPago: 'Aprobado' }
      ];

      localStorage.setItem('gamehub_ordenes', JSON.stringify(ordenesMock));

      const resultado = obtenerOrdenesGuardadas();

      expect(resultado.length).toBe(2);
      expect(resultado[0].numero).toBe('GH-1001');
      expect(resultado[1].total).toBe(25000);
    });

    it('debe retornar un arreglo vacío si el contenido de localStorage no es un arreglo (ej. un objeto o string simple)', () => {
      localStorage.setItem('gamehub_ordenes', JSON.stringify({ mensaje: 'no soy un arreglo' }));

      const resultado = obtenerOrdenesGuardadas();

      expect(Array.isArray(resultado)).toBe(true);
      expect(resultado.length).toBe(0);
    });

    it('debe capturar el error y retornar un arreglo vacío si el contenido de localStorage tiene un JSON corrupto', () => {
      spyOn(console, 'error');
      
      localStorage.setItem('gamehub_ordenes', '{json_invalido: true');

      const resultado = obtenerOrdenesGuardadas();

      expect(Array.isArray(resultado)).toBe(true);
      expect(resultado.length).toBe(0);
      expect(console.error).toHaveBeenCalled();
    });

  });

});