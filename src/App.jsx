import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext.jsx';
import Home from './views/Home.jsx'
import Carrito from './views/Carrito/Carrito.jsx'
import Catalogo from './views/Catalogo.jsx'
import Checkout from './views/Checkout.jsx'
import Ordenes from './views/Ordenes.jsx'
import { DetalleProducto } from './views/DetalleProducto/DetalleProducto.jsx';
import './App.css'

function App() {

  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/carrito" element={<Carrito/>} />
          <Route path="/catalogo" element={<Catalogo/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/ordenes" element={<Ordenes/>} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>

  )
}

export default App
