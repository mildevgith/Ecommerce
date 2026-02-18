// src/components/Navbar.jsx
import {
  Home,
  LogOut // Añadí este para un posible botón de salida
  ,
  Menu,
  Search,
  ShoppingCart,
  Tag,
  User,
  X
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/imgsHero/logo.png";
import slogan from "../assets/imgsHero/slogan.png";
import { useAuth } from "../Hooks/useAuth.jsx";// 👈 IMPORTANTE: Usamos el hook profesional

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth(); // 👈 Extraemos los datos globales

  // Función para formatear el nombre (muestra el nombre o el inicio del email)
  const displayName = user?.nombre || user?.email?.split('@')[0] || "Usuario";

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo + Slogan */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-12 w-auto sm:h-14 transition-transform hover:scale-105" />
            <img src={slogan} alt="Slogan Expomarket" className="h-8 w-auto sm:h-10 block" />
          </Link>

          {/* Buscador central (escritorio) */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center w-full max-w-md bg-gray-100 rounded-full shadow-inner focus-within:ring-2 focus-within:ring-[#ff9800]">
              <input type="text" placeholder="Buscar productos..." className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-700 focus:outline-none" />
              <button className="bg-[#ff9800] hover:bg-[#fb8c00] text-white rounded-full p-2 transition">
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Enlaces escritorio */}
          <div className="hidden md:flex items-center space-x-6 text-[#1a237e] font-medium">
            <Link to="/" className="flex items-center gap-1 hover:text-[#ff9800] transition">
              <Home size={15} /> Inicio
            </Link>
            <Link to="/ofertas" className="flex items-center gap-1 hover:text-[#ff9800] transition">
              <Tag size={15} /> Ofertas
            </Link>

            {/* BOTÓN DINÁMICO: MI CUENTA / NOMBRE */}
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

          {/* Menú móvil */}
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
            {/* ... buscador móvil ... */}

            {/* Links de navegación móvil dinámicos */}
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

            {/* Opción de cerrar sesión rápida en móvil si está logueado */}
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
