import {
  ChevronDown,
  ChevronRight,
  LogOut,
  MapPin,
  Menu,
  Percent,
  Phone,
  Search,
  ShoppingCart,
  User,
  UtensilsCrossed,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios"; // Importado para traer las categorías dinámicamente
import { useCart } from "../context/CartContext";

import logoImg from "../assets/logo.png";
import logohome from "../assets/logohome.jpg";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]); // Estado para las categorías del menú desplegable
  const [isProductsOpen, setIsProductsOpen] = useState(false); // Control del dropdown en PC
  const { cart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Cargar categorías para el menú desplegable profesional (excluyendo transporte/fletes)
    const fetchCategories = async () => {
      try {
        const resCat = await api.get('/categorias/');
        const dataCat = resCat.data;
        const catList = Array.isArray(dataCat) ? dataCat : (dataCat.results || []);

        const filteredCategories = catList.filter((cat) => {
          const nombre = (cat.nombre || "").toLowerCase();
          return !nombre.includes("transporte") && !nombre.includes("fletes") && !nombre.includes("logística");
        });

        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error cargando categorías en Navbar:", error);
      }
    };
    fetchCategories();
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
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm font-sans">
      {/* BARRA SUPERIOR PROFESIONAL (TOP BAR) */}
      <div className="bg-[#242A57] text-white text-[12px] py-1.5 px-4 md:px-10">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-200">
              <MapPin className="w-3.5 h-3.5 text-[#DE6E28]" /> Cali y Alrededores
            </span>
            <span className="hidden md:inline text-gray-400">|</span>
            <span className="hidden md:flex items-center gap-1 text-gray-200">
               Envíos seguros y cadena de frío garantizada
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://wa.me/573174262521" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gray-200 hover:text-[#DE6E28] transition-colors font-medium">
              <Phone className="w-3.5 h-3.5 text-[#DE6E28]" /> WhatsApp: 317 426 2521
            </a>
          </div>
        </div>
      </div>

      {/* NAVBAR PRINCIPAL */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 h-20 flex items-center justify-between gap-4">

        <Link to="/" className="flex items-center gap-3 shrink-0 transition-transform hover:scale-[1.02]">
          <img src={logoImg} alt="Mixtura" className="h-12 md:h-14 w-auto object-contain" />
          <div className="hidden lg:block h-8 w-[1px] bg-gray-200"></div>
          <div className="hidden lg:flex flex-col justify-center leading-none">
            <img src={logohome} alt="Sello de Calidad" className="h-18 w-auto object-contain opacity-120" />
          </div>
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden md:flex grow max-w-xl relative items-center bg-gray-50 rounded-full border border-transparent focus-within:border-gray-200 focus-within:bg-white focus-within:shadow-md transition-all duration-300"
        >
          <Search className="text-gray-400 ml-4 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Encuentra acuícolas ..."
            className="w-full bg-transparent py-2.5 px-3 outline-none text-[13px] text-gray-700 font-medium"
          />
          <button
            type="submit"
            className="bg-[#DE6E28] text-white px-6 py-2 m-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-[#C55D1F] transition-all shadow-sm active:scale-95"
          >
            Explorar
          </button>
        </form>

        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden xl:flex items-center gap-10 text-[#242A57]">
            <Link to="/" className="text-[14px] font-bold hover:text-[#DE6E28] transition-colors">
              Inicio
            </Link>

            {/* MENÚ DESPLEGABLE DE PRODUCTOS Y CATEGORÍAS */}
            <div
              className="relative py-2"
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <Link to="/productos" className="text-[14px] font-bold hover:text-[#DE6E28] transition-colors flex items-center gap-1">
                Productos <ChevronDown className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180 text-[#DE6E28]' : ''}`} />
              </Link>

              {isProductsOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-gray-100 shadow-xl rounded-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-[11px] font-bold text-gray-400 uppercase px-3 py-1 tracking-wider">Categorías</div>
                  <Link to="/productos" className="block px-3 py-2 rounded-xl text-sm font-bold text-[#242A57] hover:bg-orange-50 hover:text-[#DE6E28] transition-colors">
                     Ver Todos los Productos
                  </Link>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/categoria/${cat.id}`}
                      className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-orange-50 hover:text-[#DE6E28] transition-colors"
                    >
                      {cat.nombre}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/ofertas"
              className="text-[14px] font-bold hover:text-[#DE6E28] transition-colors flex items-center gap-1.5"
            >
              <Percent className="w-4 h-4 text-[#DE6E28]" /> Ofertas
            </Link>

            {/* NUEVO BOTÓN DE RECETAS INNOVADOR */}
            <Link
              to="/recetas"
              className="text-[14px] font-extrabold hover:text-[#DE6E28] transition-all flex items-center gap-1.5 px-3 py-1.5 bg-orange-50/80 rounded-full text-[#DE6E28] border border-orange-100 shadow-2xs hover:scale-105"
            >
              <UtensilsCrossed className="w-4 h-4 text-[#DE6E28]" /> Recetas del Mar
            </Link>
          </nav>

          <div className="hidden md:block h-6 w-[1px] bg-gray-200"></div>

          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 cursor-pointer group border border-gray-100 hover:border-gray-200 bg-gray-50/50 hover:bg-white py-1.5 pr-4 pl-1.5 rounded-full transition-all shadow-sm"
              onClick={() => !user && navigate("/auth")}
            >
              <div className="bg-[#242A57] group-hover:bg-[#DE6E28] p-2 rounded-full text-white transition-all shadow-inner">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="text-[13px] font-extrabold text-[#242A57] group-hover:text-[#DE6E28]">
                  {user ? user.first_name : "Ingresar"}
                </span>
                {user && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLogout(); }}
                    className="text-[10px] text-red-500 font-bold uppercase tracking-tighter flex items-center gap-1 hover:underline text-left"
                  >
                    Cerrar sesión
                  </button>
                )}
              </div>
            </div>

            <Link to="/carrito" className="relative p-2.5 bg-gray-50 border border-gray-100 rounded-full hover:bg-gray-100 hover:shadow-sm transition-all group active:scale-90">
              <ShoppingCart className="w-5 h-5 text-[#242A57] group-hover:text-[#DE6E28] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#DE6E28] text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="xl:hidden p-2 text-[#242A57] hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MÓVIL */}
      <div className={`fixed inset-0 top-[112px] bg-white z-50 xl:hidden transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 space-y-6 h-full flex flex-col overflow-y-auto">
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

          <nav className="flex flex-col gap-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-[15px] font-bold text-[#242A57]">
              Inicio <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>
            <Link to="/productos" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-[15px] font-bold text-[#242A57]">
              Productos y Catálogo <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            <div className="pl-4 space-y-2 border-l-2 border-orange-200 my-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/categoria/${cat.id}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-1.5 text-sm font-medium text-gray-600 hover:text-[#DE6E28]"
                >
                  • {cat.nombre}
                </Link>
              ))}
            </div>

            <Link to="/ofertas" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl text-[15px] font-bold text-[#242A57]">
              <span className="flex items-center gap-2"><Percent className="w-4 h-4 text-[#DE6E28]" /> Ofertas</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </Link>

            {/* Botón de Recetas en Móvil */}
            <Link to="/recetas" onClick={() => setIsMenuOpen(false)} className="flex items-center justify-between p-4 bg-orange-50 rounded-2xl text-[15px] font-black text-[#DE6E28] border border-orange-100">
              <span className="flex items-center gap-2"><UtensilsCrossed className="w-4 h-4" /> Recetas del Mar</span>
              <ChevronRight className="w-4 h-4 text-[#DE6E28]" />
            </Link>
          </nav>

          <div className="pt-4 mt-auto border-t border-gray-100">
            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-2xl">
                  <div className="bg-[#DE6E28] p-2.5 rounded-full text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[14px] font-extrabold text-[#242A57]">
                      {user.first_name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="text-[11px] text-red-500 font-bold uppercase tracking-wider flex items-center gap-1 mt-1 hover:underline text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setIsMenuOpen(false); navigate("/auth"); }}
                className="w-full bg-[#242A57] text-white py-3.5 rounded-2xl font-bold text-center text-[14px]"
              >
                Ingresar a mi cuenta
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
