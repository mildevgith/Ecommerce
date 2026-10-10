// src/pages/Productos.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from '../axios';
import mix from "../assets/mix.jpeg";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Eye, MessageSquare, Sparkles, ShieldCheck, CheckCircle } from "lucide-react";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const { addToCart } = useCart();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  const whatsappNumber = "573174262521";

  useEffect(() => {
    const obtenerProductos = async () => {
      setLoading(true);
      try {
        const endpoint = searchTerm
          ? `/productos/?search=${encodeURIComponent(searchTerm)}`
          : '/productos/';

        const response = await axios.get(endpoint);
        const dataFinal = response.data.results ? response.data.results : response.data;

        setProductos(Array.isArray(dataFinal) ? dataFinal : []);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
        setProductos([]);
      } finally {
        setLoading(false);
      }
    };
    obtenerProductos();
  }, [searchTerm]);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = productos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(productos.length / productsPerPage);

  const getImageUrl = (url = "") => {
    if (!url) return "https://via.placeholder.com/400x300?text=Expomarket";
    const urlStr = String(url);
    if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
      return urlStr;
    }
    const baseURL = import.meta.env.VITE_BACKEND_URL || "https://ecommerce-dsr6.onrender.com";
    return `${baseURL}${urlStr}`;
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* HERO SECTION */}
      <section className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-slate-900 shadow-lg">
        <img src={mix} alt="Productos frescos" className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#242A57]/80 via-slate-900/40 to-transparent"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#DE6E28]/20 border border-[#DE6E28]/40 text-orange-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Selección Exclusiva en Cali
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
            Productos Frescos <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Directamente del Mar</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Garantizamos cadena de frío ideal, calidad premium y el mejor sabor para tu hogar o negocio.
          </p>
        </div>
        <svg className="absolute bottom-0 w-full text-slate-50/50 fill-current" viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,100L1320,100C1200,100,960,100,720,100C480,100,240,100,120,100L0,100Z"></path>
        </svg>
      </section>

      {/* CATÁLOGO DE PRODUCTOS */}
      <section className="container mx-auto px-4 md:px-8 py-14 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 border-b border-gray-200 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#DE6E28] block mb-1">Catálogo Oficial</span>
            <h2 className="text-3xl font-black text-[#242A57]">
              {searchTerm ? `Resultados para: "${searchTerm}"` : "Nuestras Delicias del Mar"}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 bg-white py-2 px-4 rounded-full border border-gray-100 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Cadena de frío 100% garantizada
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#242A57] border-t-[#DE6E28]"></div>
            <p className="text-gray-500 font-bold text-sm">Cargando la mejor selección marina...</p>
          </div>
        ) : (
          <>
            {productos.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-xs max-w-md mx-auto p-8">
                <p className="text-gray-600 font-bold text-lg mb-2">No encontramos productos</p>
                <p className="text-gray-400 text-sm">Intenta realizando otra búsqueda o explora nuestras categorías.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProducts.map((producto) => (
                  <div
                    key={producto.id}
                    className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* CONTENEDOR DE IMAGEN CON EFECTO HOVER */}
                      <div className="relative overflow-hidden h-64 bg-gray-100">
                        <img
                          src={getImageUrl(producto.imagen)}
                          alt={producto.nombre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Expomarket'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <button
                            onClick={() => setProductoSeleccionado(producto)}
                            className="w-full bg-white/90 backdrop-blur-md text-[#242A57] py-2 rounded-xl text-xs font-extrabold shadow-md hover:bg-white transition-all flex items-center justify-center gap-1.5"
                          >
                            <Eye size={14} /> Vista Rápida
                          </button>
                        </div>
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#242A57] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                          Frescura Garantizada
                        </div>
                      </div>

                      {/* INFORMACIÓN DEL PRODUCTO */}
                      <div className="p-6 pb-2">
                        <h3 className="text-lg font-black text-[#242A57] group-hover:text-[#DE6E28] transition-colors line-clamp-1">
                          {producto.nombre}
                        </h3>
                        <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                          {producto.descripcion || "Producto fresco seleccionado rigurosamente bajo estrictos estándares de calidad."}
                        </p>
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-2xl font-black text-[#242A57]">
                            ${Number(producto.precio).toLocaleString("es-CO")}
                          </span>
                          <span className="text-xs font-bold text-gray-400">/ lb o kg</span>
                        </div>
                      </div>
                    </div>

                    {/* BOTONES DE ACCIÓN PROFESIONALES */}
                    <div className="p-6 pt-4 space-y-2.5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => addToCart(producto)}
                          className="flex-1 bg-[#242A57] text-white py-3 rounded-2xl text-xs font-extrabold hover:bg-[#DE6E28] transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95"
                        >
                          <ShoppingCart size={16} /> Añadir
                        </button>

                        <button
                          onClick={() => setProductoSeleccionado(producto)}
                          className="px-4 py-3 rounded-2xl text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
                        >
                          Detalles
                        </button>
                      </div>

                      {/* BOTÓN VENTAS MAYORISTAS */}
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola Expomarket! Me interesa cotizar al por mayor el producto: ${producto.nombre}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-600 text-white py-3 rounded-2xl text-xs font-extrabold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
                      >
                        <MessageSquare size={16} /> Ventas Mayoristas
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* PAGINACIÓN */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-14">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setCurrentPage(num);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-2xl text-sm font-bold transition-all shadow-xs ${
                      currentPage === num
                        ? "bg-[#DE6E28] text-white shadow-orange-500/30 scale-105"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-[#DE6E28]"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* MODAL DE DETALLES */}
      {productoSeleccionado && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
          onClick={() => setProductoSeleccionado(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full w-9 h-9 flex items-center justify-center transition-colors z-20 shadow-xs"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 h-72 md:h-auto bg-gray-100 relative">
                <img
                  src={getImageUrl(productoSeleccionado.imagen)}
                  alt={productoSeleccionado.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Expomarket'; }}
                />
              </div>

              <div className="md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-[#DE6E28] uppercase tracking-widest block mb-1">Detalle del Producto</span>
                  <h2 className="text-2xl font-black text-[#242A57] mb-3">{productoSeleccionado.nombre}</h2>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {productoSeleccionado.descripcion || "Producto fresco seleccionado rigurosamente bajo estrictos estándares de cadena de frío y calidad para asegurar un sabor inigualable."}
                  </p>

                  <div className="bg-orange-50/50 border border-orange-100 p-3.5 rounded-2xl mb-6 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <CheckCircle className="w-4 h-4 text-[#DE6E28]" /> Venta al detal (Libra / Kilo)
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <CheckCircle className="w-4 h-4 text-[#DE6E28]" /> Suministro institucional para restaurantes
                    </div>
                  </div>

                  <p className="text-[#242A57] text-3xl font-black mb-6">
                    ${Number(productoSeleccionado.precio).toLocaleString("es-CO")} <span className="text-xs font-bold text-gray-400">/ unidad</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(productoSeleccionado);
                        setProductoSeleccionado(null);
                      }}
                      className="flex-1 bg-[#242A57] text-white py-3.5 rounded-2xl text-xs font-black hover:bg-[#DE6E28] transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} /> Añadir al carrito
                    </button>
                    <button
                      onClick={() => setProductoSeleccionado(null)}
                      className="px-5 border border-gray-200 text-gray-600 rounded-2xl text-xs font-bold hover:bg-gray-50 transition-colors"
                    >
                      Cerrar
                    </button>
                  </div>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola Expomarket! Me interesa cotizar al por mayor el producto: ${productoSeleccionado.nombre}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block bg-emerald-600 text-white py-3.5 rounded-2xl text-xs font-black text-center hover:bg-emerald-700 transition-colors shadow-sm"
                  >
                     Hablar con Asesor Mayorista
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
