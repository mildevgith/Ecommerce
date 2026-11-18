import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { CartProvider } from "./context/CartContext";
import AuthPage from "./pages/AuthPage";
import Carrito from "./pages/Carrito";
import CategoriaProductos from "./pages/CategoriaProductos";
import Checkout from "./pages/Checkout";
import Confirmacion from "./pages/Confirmacion";
import Home from "./pages/Home";
import Ofertas from "./pages/Ofertas";
import Productos from "./pages/Productos";
import Recetas from "./pages/Recetas";
import ScrollToTop from "./components/ScrollToTop";
import RecuperarPassword from "./pages/RecuperarPassword";
import GoogleOneTap from "./components/GoogleOneTap";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/auth" replace />;
};

function App() {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <CartProvider>
      <ScrollToTop />
      {!isAuthenticated && (
        <GoogleOneTap onSuccessLogin={() => window.location.reload()} />
      )}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="productos" element={<Productos />} />
          <Route path="ofertas" element={<Ofertas />} />
          <Route path="/recetas" element={<Recetas />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="confirmacion" element={<Confirmacion />} />
          <Route path="/categoria/:slug" element={<CategoriaProductos />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="login" element={<Navigate to="/auth" replace />} />
          <Route path="registro" element={<Navigate to="/auth" replace />} />
          <Route path="/recuperar-password" element={<RecuperarPassword />} />
          <Route
            path="cuenta"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </CartProvider>
  );
}

export default App;
