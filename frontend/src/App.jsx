import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Ofertas from "./pages/Ofertas";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";
import Carrito from "./pages/Carrito";
import Cuenta from "./pages/Cuenta";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import ProductoDetalle from "./pages/ProductoDetalle";
import Checkout from "./pages/Checkout";
import Confirmacion from "./pages/Confirmacion";
import Footer from "./components/Footer";
import ProductoCategoria from "./pages/ProductoCategoria";

function App() {
  return (
    <Routes>
      {/* Layout envuelve todas las rutas */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:categoria" element={<ProductoCategoria />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="cuenta" element={<Cuenta />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="productoDetalle/:id" element={<ProductoDetalle />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="confirmacion" element={<Confirmacion />} />
      </Route>
    </Routes>
  );
}

export default App;
