import {
    validarFormulario,
    guardarOrdenEnLocalStorage
} from './validaciones.js';

describe('Pruebas unitarias - Validaciones y Órdenes (GameHub Store)', () => {

    // Mock de un formulario de cliente válido
    const formularioValido = {
        nombre: 'Gamehub Test',
        correo: 'Test@gamehub.cl',
        telefono: '+56912345678',
        region: 'Valparaíso',
        comuna: 'Viña del Mar',
        direccion: 'Av. Libertad 1234',
        metodoPago: 'credito'
    };

    describe('validarFormulario()', () => {
        it('debe retornar esValido: true cuando todos los campos son correctos', () => {
            const resultado = validarFormulario(formularioValido);
            expect(resultado.esValido).toBe(true);
            expect(Object.keys(resultado.errores).length).toBe(0);
        });

        it('debe detectar campos vacíos obligatorios', () => {
            const resultado = validarFormulario({});
            expect(resultado.esValido).toBe(false);
            expect(resultado.errores.nombre).toBe('Ingresa tu nombre completo.');
            expect(resultado.errores.correo).toBe('Ingresa tu correo.');
            expect(resultado.errores.telefono).toBe('Ingresa tu teléfono.');
            expect(resultado.errores.region).toBe('Selecciona una región.');
            expect(resultado.errores.comuna).toBe('Ingresa tu comuna.');
            expect(resultado.errores.direccion).toBe('Ingresa tu dirección.');
            expect(resultado.errores.metodoPago).toBe('Selecciona un método de pago.');
        });

        it('debe rechazar correos con formato inválido', () => {
            const formularioConCorreoInvalido = { ...formularioValido, correo: 'correo_sin_arroba.com' };
            const resultado = validarFormulario(formularioConCorreoInvalido);

            expect(resultado.esValido).toBe(false);
            expect(resultado.errores.correo).toBe('Ingresa un correo válido.');
        });

        it('debe validar números celulares chilenos (+569XXXXXXXX o 9XXXXXXXX)', () => {
            const conPrefijo = { ...formularioValido, telefono: '+56 9 8765 4321' };
            const sinPrefijo = { ...formularioValido, telefono: '987654321' };
            const numeroInvalido = { ...formularioValido, telefono: '12345' };

            expect(validarFormulario(conPrefijo).esValido).toBe(true);
            expect(validarFormulario(sinPrefijo).esValido).toBe(true);

            const resInvalido = validarFormulario(numeroInvalido);
            expect(resInvalido.esValido).toBe(false);
            expect(resInvalido.errores.telefono).toBe('Ingresa un celular chileno válido.');
        });
    });});

    describe('guardarOrdenEnLocalStorage()', () => {
        beforeEach(() => {
            // Limpia el localStorage antes de cada prueba
            localStorage.clear();
        });

        it('debe guardar la orden correctamente en localStorage', () => {
            const ordenPrueba = { numero: 'GH-12345678', total: 50000 };

            guardarOrdenEnLocalStorage(ordenPrueba);

            const guardadas = JSON.parse(localStorage.getItem('gamehub_ordenes'));
            expect(guardadas.length).toBe(1);
            expect(guardadas[0].numero).toBe('GH-12345678');
        });

        it('debe anteponer la nueva orden a las órdenes existentes', () => {
            const orden1 = { numero: 'GH-11111111' };
            const orden2 = { numero: 'GH-22222222' };

            guardarOrdenEnLocalStorage(orden1);
            guardarOrdenEnLocalStorage(orden2);

            const guardadas = JSON.parse(localStorage.getItem('gamehub_ordenes'));
            expect(guardadas.length).toBe(2);
            expect(guardadas[0].numero).toBe('GH-22222222'); // La más reciente queda primero
        });
    });