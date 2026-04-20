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
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import slogan from "../assets/slogan.png";
import { useAuth } from "../Hooks/useAuth.jsx";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  // 1. Priorizamos la foto del perfil que vendrá de la DB
  const userPhoto = user?.foto;

  // 2. Extraemos la inicial y el nombre para mostrar
  const displayName = user?.nombre || user?.email?.split('@')[0] || "Usuario";
  const initial = displayName.charAt(0).toUpperCase();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm)}`);
      setMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo + Slogan */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-12 w-auto sm:h-14 transition-transform hover:scale-105" />
            <img src={slogan} alt="Slogan" className="h-8 w-auto sm:h-10 hidden lg:block" />
          </Link>

          {/* Buscador central */}
          <div className="hidden md:flex flex-1 justify-center px-8">
            <form onSubmit={handleSearchSubmit} className="flex items-center w-full max-w-md bg-gray-100 rounded-full shadow-inner focus-within:ring-2 focus-within:ring-orange-400 transition-all">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="flex-1 bg-transparent px-5 py-2 text-sm text-gray-700 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white rounded-full p-1.5 mr-1 transition">
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* Enlaces de navegación escritorio */}
          <div className="hidden md:flex items-center space-x-6 text-[#1a237e] font-medium">
            <Link to="/" className="flex items-center gap-1 hover:text-orange-500 transition">
              <Home size={16} /> Inicio
            </Link>
            <Link to="/ofertas" className="flex items-center gap-1 hover:text-orange-500 transition">
              <Tag size={16} /> Ofertas
            </Link>

            {/* BOTÓN DE CUENTA DINÁMICO */}
            <div className="flex items-center">
              <Link
                to="/cuenta"
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all border ${
                  isAuthenticated
                  ? "bg-orange-50 border-orange-200 hover:bg-orange-100 shadow-sm"
                  : "bg-slate-50 border-transparent hover:border-orange-200"
                }`}
              >
                {isAuthenticated ? (
                  /* Contenedor de Imagen de Perfil o Inicial */
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shadow-sm overflow-hidden border border-white">
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt="Perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-xs font-bold leading-none">{initial}</span>
                    )}
                  </div>
                ) : (
                  <User size={16} className="text-slate-400" />
                )}

                <span className={`text-sm whitespace-nowrap ${isAuthenticated ? "font-bold text-orange-700" : ""}`}>
                  {isAuthenticated ? displayName : "Mi Cuenta"}
                </span>
              </Link>

              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="ml-2 p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>

            <Link to="/carrito" className="flex items-center gap-1 hover:text-orange-500 transition">
              <ShoppingCart size={18} />
            </Link>
          </div>

          {/* Menú móvil */}
          <div className="md:hidden flex items-center gap-3">
            {isAuthenticated && (
              <Link to="/cuenta" className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                {userPhoto ? (
                  <img src={userPhoto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-xs font-bold">{initial}</span>
                )}
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
              {menuOpen ? <X size={28} className="text-[#1a237e]" /> : <Menu size={28} className="text-[#1a237e]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="px-5 py-6 space-y-4">
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-gray-700 font-semibold py-2">
              <Home size={20} /> Inicio
            </Link>
            <Link to="/ofertas" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-gray-700 font-semibold py-2">
              <Tag size={20} /> Ofertas
            </Link>
            <Link to="/cuenta" onClick={() => setMenuOpen(false)} className={`flex items-center gap-3 py-2 ${isAuthenticated ? 'text-orange-600 font-bold' : 'text-gray-700 font-semibold'}`}>
              <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold overflow-hidden shadow-sm">
                {isAuthenticated && userPhoto ? (
                  <img src={userPhoto} alt="Perfil" className="w-full h-full object-cover" />
                ) : (
                  <span className={isAuthenticated ? "text-xs" : ""} style={{fontSize: isAuthenticated ? '12px' : '20px'}}>
                    {isAuthenticated ? initial : <User size={18} />}
                  </span>
                )}
              </div>
              {isAuthenticated ? `Perfil de ${displayName}` : "Mi Cuenta"}
            </Link>

            {isAuthenticated && (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="flex items-center gap-3 text-red-500 font-semibold py-2 w-full text-left"
              >
                <LogOut size={20} /> Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
