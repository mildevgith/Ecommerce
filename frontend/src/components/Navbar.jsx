import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
    <header className="bg-white py-3 px-8 flex items-center justify-between shadow-sm sticky top-0 z-50">

      {/* LOGO MIXTURA */}
      <Link to="/" className="flex items-center">
        <img src="/logo.png" alt="Mixtura" className="h-10 w-auto" />
      </Link>

      {/* BUSCADOR (Píldora con botón naranja a la derecha) */}
      <form onSubmit={handleSearch} className="flex-grow max-w-2xl mx-10 relative flex items-center bg-[#f1f3f5] rounded-full px-1 border border-transparent focus-within:border-gray-200">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full bg-transparent py-2 px-6 outline-none text-sm text-gray-600"
        />
        <button
          type="submit"
          className="bg-[#de6e28] text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase hover:bg-[#c55d1f] transition-all"
        >
          search
        </button>
      </form>

      {/* NAVEGACIÓN Y ACCIONES */}
      <div className="flex items-center gap-8 text-[#242a57]">

        <Link to="/" className="flex items-center gap-1 hover:text-[#de6e28] transition-colors">
          <span className="material-icons">home</span>
          <span className="text-sm font-semibold">Inicio</span>
        </Link>

        <Link to="/ofertas" className="flex items-center gap-1 hover:text-[#de6e28] transition-colors">
          <span className="material-icons">sell</span>
          <span className="text-sm font-semibold">Ofertas</span>
        </Link>

        {/* SEPARADOR VERTICAL */}
        <div className="h-6 w-[1px] bg-gray-200 mx-2"></div>

        {/* USUARIO Y CARRITO */}
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-1 cursor-pointer hover:text-[#de6e28]"
            onClick={() => !user && navigate("/auth")}
          >
            <span className="material-icons">person</span>
            <span className="text-sm font-bold">
              {user ? (user.first_name || "Carlos Ruiz") : "Mi Cuenta"}
            </span>
          </div>

          {user && (
            <button onClick={handleLogout} className="text-red-500 font-bold text-[10px] uppercase hover:underline">
              logout
            </button>
          )}

          <Link to="/carrito" className="relative flex items-center group">
            <span className="material-icons text-[26px]">shopping_cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#de6e28] text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
