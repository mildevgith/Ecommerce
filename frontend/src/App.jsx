import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { CartProvider } from "./context/CartContext";
import AuthPage from "./pages/AuthPage";
import Carrito from "./pages/Carrito";
import Checkout from "./pages/Checkout";
import Confirmacion from "./pages/Confirmacion";
import Home from "./pages/Home";
import Ofertas from "./pages/Ofertas";
import Productos from "./pages/Productos";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<Productos />} />
          <Route path="ofertas" element={<Ofertas />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="confirmacion" element={<Confirmacion />} />

          {/* Rutas de Autenticación Unificadas */}
          <Route path="auth" element={<AuthPage />} />
          <Route path="login" element={<Navigate to="/auth" replace />} />
          <Route path="registro" element={<Navigate to="/auth" replace />} />
          <Route path="cuenta" element={<ProtectedRoute><Home /></ProtectedRoute>} />

          {/* Checkout Real Protegido */}
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
