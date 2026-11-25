import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import AuthProvider from './auth/authProvider.jsx';
import RutaProtegida from './auth/rutaProtegida.jsx';

import Home from './views/Home/Home.jsx';
import Carrito from './views/Carrito/Carrito.jsx';
import Catalogo from './views/Catalogo.jsx';
import Checkout from './views/Checkout/Checkout.jsx';
import Ordenes from './views/Ordenes.jsx';
import Login from './views/Login/Login.jsx';
import { DetalleProducto } from './views/DetalleProducto/DetalleProducto.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Vistas públicas (Visitante) */}
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/producto/:id" element={<DetalleProducto />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />

            {/* Vistas protegidas (requieren sesión iniciada) */}
            <Route
              path="/checkout"
              element={
                <RutaProtegida>
                  <Checkout />
                </RutaProtegida>
              }
            />
            <Route
              path="/ordenes"
              element={
                <RutaProtegida>
                  <Ordenes />
                </RutaProtegida>
              }
            />

            {/* Paneles por rol requeridos*/}
            <Route
              path="/operador"
              element={
                <RutaProtegida rolesPermitidos={['ROLE_OPERADOR', 'ROLE_ADMIN']}>
                  {/* Aquí irá el componente PanelOperador */}
                  <div className="container py-5 text-light"><h2>Panel del Operador</h2></div>
                </RutaProtegida>
              }
            />
            <Route
              path="/admin"
              element={
                <RutaProtegida rolesPermitidos={['ROLE_ADMIN']}>
                  {/* Aquí irá el componente PanelAdmin */}
                  <div className="container py-5 text-light"><h2>Panel de Administración</h2></div>
                </RutaProtegida>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;