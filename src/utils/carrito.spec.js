import {
  validarStock,
  calcularSubtotal,
  agregarAlCarrito,
  actualizarCantidadLinea,
  eliminarDelCarrito,
  aplicarCupon,
  calcularTotal
} from './carrito.js';

describe('Pruebas lógica de carrito', () => {

  // Mock de productos de prueba
  const productoNotebook = {
    id: 1,
    nombre: "Asus ROG Strix G16",
    marca: "ASUS",
    precio: 1299990,
    stock: 9
  };

  const productoPS5 = {
    id: 5,
    nombre: "PlayStation 5",
    marca: "SONY",
    precio: 499999,
    stock: 3
  };

  // 1. Pruebas para validarStock
  describe('validarStock()', () => {
    it('debe retornar true si la cantidad solicitada es menor o igual al stock disponible', () => {
      expect(validarStock(2, 5)).toBe(true);
      expect(validarStock(5, 5)).toBe(true);
    });

    it('debe retornar false si la cantidad solicitada supera el stock disponible', () => {
      expect(validarStock(10, 9)).toBe(false);
    });

    it('debe retornar false si la cantidad solicitada es menor o igual a 0', () => {
      expect(validarStock(0, 5)).toBe(false);
      expect(validarStock(-1, 5)).toBe(false);
    });
  });

  // 2. Pruebas para calcularSubtotal
  describe('calcularSubtotal()', () => {
    it('debe calcular el subtotal correctamente multiplicando precio y cantidad', () => {
      const items = [
        { precio: 1000, cantidad: 2 }, // 2000
        { precio: 500, cantidad: 3 }   // 1500
      ];
      expect(calcularSubtotal(items)).toBe(3500);
    });

    it('debe retornar 0 si el carrito está vacío', () => {
      expect(calcularSubtotal([])).toBe(0);
    });
  });

  // 3. Pruebas para agregarAlCarrito
  describe('agregarAlCarrito()', () => {
    it('debe agregar un nuevo producto al carrito cuando tiene stock', () => {
      const carritoInicial = [];
      const resultado = agregarAlCarrito(carritoInicial, productoNotebook, 1);

      expect(resultado.length).toBe(1);
      expect(resultado[0].id).toBe(1);
      expect(resultado[0].cantidad).toBe(1);
    });

    it('debe incrementar la cantidad si el producto ya existe en el carrito', () => {
      const carritoInicial = [{ ...productoNotebook, cantidad: 2 }];
      const resultado = agregarAlCarrito(carritoInicial, productoNotebook, 1);

      expect(resultado.length).toBe(1);
      expect(resultado[0].cantidad).toBe(3);
    });

    it('no debe permitir agregar un producto si la suma supera el stock disponible', () => {
      const carritoInicial = [{ ...productoPS5, cantidad: 3 }]; // Stock límite es 3
      const resultado = agregarAlCarrito(carritoInicial, productoPS5, 1);

      expect(resultado[0].cantidad).toBe(3); // Mantiene la cantidad sin cambios
    });
  });

  // 4. Pruebas para actualizarCantidadLinea
  describe('actualizarCantidadLinea()', () => {
    it('debe actualizar la cantidad de un producto dentro del límite de stock', () => {
      const carritoInicial = [{ ...productoNotebook, cantidad: 1 }];
      const resultado = actualizarCantidadLinea(carritoInicial, 1, 4);

      expect(resultado[0].cantidad).toBe(4);
    });

    it('debe limitar la cantidad al stock máximo si se intenta exceder', () => {
      const carritoInicial = [{ ...productoPS5, cantidad: 1 }]; // Stock máximo es 3
      const resultado = actualizarCantidadLinea(carritoInicial, 5, 10);

      expect(resultado[0].cantidad).toBe(3);
    });
  });

  // 5. Pruebas para eliminarDelCarrito
  describe('eliminarDelCarrito()', () => {
    it('debe remover el producto especificado según su id', () => {
      const carritoInicial = [
        { ...productoNotebook, cantidad: 1 },
        { ...productoPS5, cantidad: 1 }
      ];
      const resultado = eliminarDelCarrito(carritoInicial, 1);

      expect(resultado.length).toBe(1);
      expect(resultado[0].id).toBe(5);
    });
  });

  // 6. Pruebas para aplicarCupon
  describe('aplicarCupon()', () => {
    it('debe otorgar 10% de descuento cuando se ingresa GAMER10', () => {
      const resultado = aplicarCupon('GAMER10');
      expect(resultado.descuentoPorcentaje).toBe(10);
      expect(resultado.mensaje.tipo).toBe('exito');
    });

    it('debe ignorar mayúsculas/minúsculas y espacios en blanco al validar GAMER10', () => {
      const resultado = aplicarCupon(' gamer10 ');
      expect(resultado.descuentoPorcentaje).toBe(10);
      expect(resultado.mensaje.tipo).toBe('exito');
    });

    it('debe retornar 0% de descuento cuando el cupón es inválido', () => {
      const resultado = aplicarCupon('CUPONFALSO');
      expect(resultado.descuentoPorcentaje).toBe(0);
      expect(resultado.mensaje.tipo).toBe('error');
    });
  });

  // 7. Pruebas para calcularTotal
  describe('calcularTotal()', () => {
    it('debe calcular el total sumando subtotal, costoEnvio y restando el descuento', () => {
      const total = calcularTotal(10000, 1000, 2000); // 10000 - 1000 + 2000
      expect(total).toBe(11000);
    });

    it('nunca debe retornar un total menor a 0', () => {
      const total = calcularTotal(5000, 10000, 0); // Descuento mayor al subtotal
      expect(total).toBe(0);
    });
  });

});