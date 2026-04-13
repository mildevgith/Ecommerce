import {
  Home,
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  Tag,
  User,
  X
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // se usa para cambiar de pagina de manera dinamica
import logo from "../assets/logo.png";
import slogan from "../assets/slogan.png";
import { useAuth } from "../Hooks/useAuth.jsx";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el buscador
  const navigate = useNavigate(); // Hook para redireccionar
  const { user, isAuthenticated, logout } = useAuth();
  const displayName = user?.nombre || user?.email?.split('@')[0] || "Usuario";

  // Función para procesar la búsqueda
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // Redirige a productos con el parámetro real que Django espera
      navigate(`/productos?search=${encodeURIComponent(searchTerm)}`);
      setMenuOpen(false); // Cierra el menú en móvil si estaba abierto
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo + Slogan */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-12 w-auto sm:h-14 transition-transform hover:scale-105" />
            <img src={slogan} alt="Slogan Expomarket" className="h-8 w-auto sm:h-10 block" />
          </Link>

          {/* Buscador central (Versión Escritorio) */}
          <div className="hidden md:flex flex-1 justify-center">
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-md bg-gray-100 rounded-full shadow-inner focus-within:ring-2 focus-within:ring-[#ff9800]">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-700 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="bg-[#ff9800] hover:bg-[#fb8c00] text-white rounded-full p-2 transition">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Enlaces escritorio */}
          <div className="hidden md:flex items-center space-x-6 text-[#1a237e] font-medium">
            <Link to="/" className="flex items-center gap-1 hover:text-[#ff9800] transition">
              <Home size={15} /> Inicio
            </Link>
            <Link to="/ofertas" className="flex items-center gap-1 hover:text-[#ff9800] transition">
              <Tag size={15} /> Ofertas
            </Link>

            <Link to="/cuenta" className="flex items-center gap-1 hover:text-[#ff9800] transition px-3 py-1 rounded-lg bg-slate-50 border border-transparent hover:border-orange-200">
              <User size={15} className={isAuthenticated ? "text-orange-500" : ""} />
              <span className={isAuthenticated ? "font-bold text-orange-600" : ""}>
                {isAuthenticated ? displayName : "Mi Cuenta"}
              </span>
            </Link>

            <Link to="/carrito" className="flex items-center gap-1 hover:text-[#ff9800] transition">
              <ShoppingCart size={15} /> Carrito
            </Link>
          </div>

          {/* Menú móvil (Icono) */}
          <div className="md:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-[#1a237e] hover:text-[#ff9800] transition">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg animate-slide-down">
          <div className="px-5 py-4 space-y-3">

            {/* Buscador móvil real */}
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2 mb-4">
              <input
                type="text"
                placeholder="Buscar..."
                className="flex-1 bg-transparent text-sm focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit">
                <Search size={16} className="text-gray-500" />
              </button>
            </form>

            {[
              { label: "Inicio", to: "/", icon: <Home size={18} /> },
              { label: "Ofertas", to: "/ofertas", icon: <Tag size={18} /> },
              {
                label: isAuthenticated ? `Hola, ${displayName}` : "Mi Cuenta",
                to: "/cuenta",
                icon: <User size={18} className={isAuthenticated ? "text-orange-500" : ""} />
              },
              { label: "Carrito", to: "/carrito", icon: <ShoppingCart size={18} /> },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 py-2 border-b transition ${item.label.includes('Hola') ? 'text-orange-600 font-bold' : 'text-gray-700'}`}
              >
                {item.icon} {item.label}
              </Link>
            ))}

            {isAuthenticated && (
              <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-2 py-2 text-red-500 w-full text-left">
                <LogOut size={18} /> Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
