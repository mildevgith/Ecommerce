import {
  ChevronDown,
  Home,
  Menu,
  Search,
  ShoppingCart,
  Tag,
  User as UserIcon,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


// Importamos el logo del grupo
import grupoGRB from "../assets/slogan.png";

export default function Navbar() {
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail"));
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  

  useEffect(() => {
    const updateNavbar = () => {
      setUserEmail(localStorage.getItem("userEmail"));
    };
    window.addEventListener("userLogin", updateNavbar);
    window.addEventListener("storage", updateNavbar);
    return () => {
      window.removeEventListener("userLogin", updateNavbar);
      window.removeEventListener("storage", updateNavbar);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUserEmail(null);
    window.dispatchEvent(new Event("userLogin"));
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm.trim()}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-[100]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* LOGOS COMBINADOS */}
          <Link to="/" className="flex items-center gap-2 sm:gap-4 flex-shrink-0 group">
            <img
              src="/src/assets/logo.png"
              alt="EXPOMARKET"
              className="h-8 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
            <div className="hidden xs:flex flex-col">
              <img
                src={grupoGRB}
                alt="GRUPO GRB"
                className="h-5 sm:h-7 w-auto object-contain opacity-80"
              />
              <span className="text-[8px] sm:text-[9px] font-bold text-slate-400 tracking-[0.2em] uppercase leading-none mt-1">
                Sello de Calidad
              </span>
            </div>
          </Link>

          {/* BUSCADOR (ESCRITORIO) */}
          <form 
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-xl relative items-center"
          >
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 px-6 focus:outline-none focus:border-orange-500 text-sm transition-all"
            />
            <button type="submit" className="absolute right-1.5 p-2 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-colors">
              <Search size={16} />
            </button>
          </form>

          {/* ICONOS Y MENÚ (ESCRITORIO) */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="hidden md:flex items-center gap-6 text-slate-600 font-bold text-sm">
              <Link to="/" className="hover:text-orange-500 flex items-center gap-2 transition-colors">
                <Home size={18} /> <span className="hidden lg:inline">Inicio</span>
              </Link>
              <Link to="/ofertas" className="hover:text-orange-500 flex items-center gap-2 transition-colors">
                <Tag size={18} /> <span className="hidden lg:inline">Ofertas</span>
              </Link>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 md:border-l md:border-slate-200 md:pl-6">
              {userEmail ? (
                <div className="relative group hidden sm:block">
                  <button className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                    <div className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                      {userEmail[0].toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-700 hidden lg:inline">
                      {userEmail.split("@")[0]}
                    </span>
                    <ChevronDown size={14} className="text-slate-400 group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/cuenta" className="block px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-t-xl">Mi Perfil</Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-b-xl">Cerrar Sesión</button>
                  </div>
                </div>
              ) : (
                <Link to="/cuenta" className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-orange-500 font-bold text-sm transition-colors">
                  <UserIcon size={18} /> <span className="hidden lg:inline">Mi Cuenta</span>
                </Link>
              )}
              
              <button className="text-slate-600 hover:text-orange-500 transition-colors p-2">
                <ShoppingCart size={24} />
              </button>

              {/* BOTÓN HAMBURGUESA (MÓVIL) */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* MENÚ DESPLEGABLE MÓVIL */}
        {isMenuOpen && (
          <div className="lg:hidden pb-6 pt-2 space-y-4 animate-in slide-in-from-top duration-300">
            {/* Buscador móvil */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="¿Qué buscas hoy?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-100 border-none rounded-xl py-3 px-5 text-sm focus:ring-2 focus:ring-orange-500"
              />
              <button type="submit" className="absolute right-3 top-3 text-slate-400">
                <Search size={20} />
              </button>
            </form>

            <div className="grid grid-cols-2 gap-3">
              <Link onClick={() => setIsMenuOpen(false)} to="/" className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl gap-2 font-bold text-slate-600 active:bg-orange-50">
                <Home size={24} className="text-orange-500" /> <span>Inicio</span>
              </Link>
              <Link onClick={() => setIsMenuOpen(false)} to="/ofertas" className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl gap-2 font-bold text-slate-600 active:bg-orange-50">
                <Tag size={24} className="text-orange-500" /> <span>Ofertas</span>
              </Link>
            </div>
            

            {userEmail ? (
              <div className="space-y-2">
                <Link onClick={() => setIsMenuOpen(false)} to="/cuenta" className="block w-full p-4 bg-slate-900 text-white rounded-2xl font-bold text-center">
                  Mi Perfil ({userEmail.split("@")[0]})
                </Link>
                <button onClick={handleLogout} className="w-full p-4 text-red-500 font-bold border border-red-100 rounded-2xl italic">
                  Cerrar Sesión de Expomar
                </button>
              </div>
            ) : (
              <Link onClick={() => setIsMenuOpen(false)} to="/cuenta" className="block w-full p-4 bg-orange-500 text-white rounded-2xl font-bold text-center">
                Iniciar Sesión / Registro
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}