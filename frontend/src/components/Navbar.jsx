import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  Search,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import logoImg from "../assets/logo.png";
import sloganImg from "../assets/slogan.png";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchTerm)}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/auth");
    window.location.reload();
  };

  const cartCount = cart?.reduce((total, item) => total + item.cantidad, 0) || 0;

  return (
    <header className="bg-white sticky top-0 z-[100] border-b border-gray-100 shadow-sm font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-20 flex items-center justify-between gap-4">

        {/* LOGO & BRANDING */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 transition-transform hover:scale-[1.02]">
          <img src={logoImg} alt="Mixtura" className="h-9 md:h-11 w-auto object-contain" />
          <div className="hidden lg:block h-8 w-[1px] bg-gray-200"></div>
          <div className="hidden lg:flex flex-col justify-center leading-none">
            <img src={sloganImg} alt="Sello de Calidad" className="h-4 w-auto object-contain opacity-80" />
            <span className="text-[8px] font-black text-gray-400 tracking-[0.2em] uppercase mt-1">
              Grupo GRB
            </span>
          </div>
        </Link>

        {/* BUSCADOR (Desktop) */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-grow max-w-xl relative items-center bg-gray-50 rounded-full border border-transparent focus-within:border-gray-200 focus-within:bg-white focus-within:shadow-md transition-all duration-300"
        >
          <Search className="text-gray-400 ml-4 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Busca productos, marcas y más..."
            className="w-full bg-transparent py-2.5 px-3 outline-none text-[13px] text-gray-700 font-medium"
          />
          <button
            type="submit"
            className="bg-[#DE6E28] text-white px-6 py-2 m-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-[#C55D1F] transition-all shadow-sm active:scale-95"
          >
            Explorar
          </button>
        </form>

        {/* ACCIONES DERECHA */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* NAV LINKS (Desktop) */}
          <nav className="hidden xl:flex items-center gap-8 text-[#242A57]">
            <Link to="/" className="text-[14px] font-bold hover:text-[#DE6E28] transition-colors">Inicio</Link>
            <Link to="/ofertas" className="text-[14px] font-bold hover:text-[#DE6E28] transition-colors">Ofertas</Link>
          </nav>

          <div className="hidden md:block h-6 w-[1px] bg-gray-200"></div>

          {/* PERFIL / LOGOUT */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => !user && navigate("/auth")}
            >
              <div className="bg-gray-100 p-2.5 rounded-full text-[#242A57] group-hover:bg-[#DE6E28] group-hover:text-white transition-all shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[13px] font-extrabold text-[#242A57] group-hover:text-[#DE6E28]">
                  {user ? user.first_name : "Ingresar"}
                </span>
                {user && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                    className="text-[10px] text-red-500 font-bold uppercase tracking-tighter flex items-center gap-1 hover:underline"
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>

            {/* CARRITO (LUCIDE ICON) */}
            <Link to="/carrito" className="relative p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-all group shadow-sm active:scale-90">
              <ShoppingCart className="w-6 h-6 text-[#242A57]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DE6E28] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* BOTÓN MENÚ MÓVIL */}
            <button
              className="md:hidden p-2 text-[#242A57] hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL FULL (Overlay) */}
      <div className={`fixed inset-0 top-20 bg-white z-[90] md:hidden transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 space-y-8 h-full flex flex-col overflow-y-auto">

          {/* BUSCADOR MÓVIL */}
          <form onSubmit={handleSearch} className="relative flex items-center bg-gray-100 rounded-2xl p-1 shadow-inner border border-gray-100">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="¿Qué estás buscando hoy?"
              className="w-full bg-transparent py-3 px-4 outline-none text-sm font-medium"
            />
            <button type="submit" className="bg-[#DE6E28] text-white p-2.5 rounded-xl shadow-md">
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* LINKS MÓVIL */}
          <nav className="flex flex-col gap-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-[15px] font-bold text-[#242A57]">
              Inicio <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link to="/ofertas" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-[15px] font-bold text-[#242A57]">
              Ofertas <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
          </nav>

          {/* PERFIL MÓVIL */}
          <div className="pt-4 mt-auto border-t border-gray-100">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-2">
                  <div className="bg-[#242A57] text-white p-3 rounded-2xl">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[12px] text-gray-400 font-bold uppercase">Sesión activa</p>
                    <p className="text-[16px] font-bold text-[#242A57]">{user.first_name}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold flex items-center justify-center gap-2 active:bg-red-100 transition-colors"
                >
                  <LogOut className="w-5 h-5" /> Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                onClick={() => { navigate("/auth"); setIsMenuOpen(false); }}
                className="w-full py-4 bg-[#242A57] text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <User className="w-5 h-5" /> Ingresar a mi cuenta
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
