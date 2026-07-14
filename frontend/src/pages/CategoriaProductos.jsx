import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ShoppingCart, Eye, X, CheckCircle2, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CategoriaProductos() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [categoria, setCategoria] = useState({ nombre: "" });
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // NUEVO: Estado para abrir el modal del producto seleccionado
  const [selectedProduct, setSelectedProduct] = useState(null);

  // CONFIGURACIÓN DE RUTA INTELIGENTE (IGUAL AL HOME)
  const esLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
  const BASE_URL = "https://serene-peace-production-62ee.up.railway.app";
  const LOCAL_URL = "http://localhost:8000";
  const API_URL = esLocal ? `${LOCAL_URL}/api` : `${BASE_URL}/api`;

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x300?text=Expomarket";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${esLocal ? LOCAL_URL : BASE_URL}${url}`;
  };

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      try {
        // 1. Obtener información de la categoría con fallback
        let catRes = await fetch(`${API_URL}/categorias/${id}/`);
        if (!catRes.ok && esLocal) {
          catRes = await fetch(`${BASE_URL}/api/categorias/${id}/`);
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategoria(catData);
        }

        // 2. Obtener los productos con fallback
        const currentApi = (!catRes.ok && esLocal) ? `${BASE_URL}/api` : API_URL;
        const prodRes = await fetch(`${currentApi}/categorias/${id}/productos/`);
        
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProductos(Array.isArray(prodData) ? prodData : prodData.results || []);
        }
      } catch (error) {
        console.error("Error cargando la categoría y sus productos:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDatos();
    }
  }, [id, API_URL, esLocal]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500 font-bold">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Cargando productos de la categoría...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Link to="/" className="inline-flex items-center text-orange-500 font-bold hover:underline mb-6 gap-2">
        <ArrowLeft size={18} /> Volver al Inicio
      </Link>

      <div className="mb-8">
        <span className="text-xs font-bold text-orange-500 tracking-wider uppercase">Categoría</span>
        <h1 className="text-4xl font-extrabold text-slate-900 uppercase">{categoria?.nombre || "MOLUSCOS"}</h1>
        <p className="text-slate-500 mt-1">
          {productos.length} {productos.length === 1 ? "producto disponible" : "productos disponibles"}
        </p>
      </div>

      {productos.length === 0 ? (
        <div className="border border-slate-200 rounded-2xl p-12 text-center bg-white shadow-sm">
          <p className="text-slate-400">No hay productos disponibles en esta categoría en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((producto) => (
            <div key={producto.id} className="group relative rounded-2xl bg-white p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="relative overflow-hidden rounded-xl h-64 bg-slate-50">
                  <img
                    src={getImageUrl(producto.imagen)}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                    alt={producto.nombre}
                  />
                  {/* Vista rápida flotante al hacer hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setSelectedProduct(producto)}
                      className="bg-white/90 backdrop-blur-xs text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-white transition-all transform scale-90 group-hover:scale-100"
                    >
                      Vista Rápida
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-2 text-center">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{producto.nombre}</h3>
                  <p className="text-xs text-slate-400 min-h-[32px] mt-1 line-clamp-2">{producto.descripcion}</p>
                  <p className="mt-2 text-orange-500 font-bold text-xl">
                    ${producto.precio ? Number(producto.precio).toLocaleString("es-CO") : "0"}
                    <span className="text-xs text-slate-400 font-normal"> / Kg</span>
                  </p>
                </div>
              </div>

              {/* ACCIONES DEL CARD: Botón Detalle + Botón Carrito */}
              <div className="p-2 pt-0 space-y-2">
                <button
                  onClick={() => setSelectedProduct(producto)}
                  className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye size={14} /> Ver Detalle Completo
                </button>
                <button
                  onClick={() => addToCart(producto)}
                  className="w-full rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VENTANA MODAL DE DETALLE DEL PRODUCTO */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              className="absolute inset-0" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
            />

            <motion.div 
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden z-10 border border-slate-100 max-h-[90vh] flex flex-col lg:flex-row"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-20 bg-slate-100 text-slate-600 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-full lg:w-1/2 h-64 lg:h-auto relative bg-slate-100">
                <img src={getImageUrl(selectedProduct.imagen)} alt={selectedProduct.nombre} className="w-full h-full object-cover" />
                {selectedProduct.precio_oferta && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase">
                    Oferta Especial
                  </div>
                )}
              </div>

              <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Categoría Premium</span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{selectedProduct.nombre}</h2>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Precio por Unidad/Kg</span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-2xl font-black text-slate-900">
                          ${Number(selectedProduct.precio_oferta || selectedProduct.precio).toLocaleString("es-CO")}
                        </span>
                        {selectedProduct.precio_oferta && (
                          <span className="text-sm text-slate-400 line-through">
                            ${Number(selectedProduct.precio).toLocaleString("es-CO")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Descripción del Producto</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedProduct.descripcion || `Frescura premium garantizada de nuestro ${selectedProduct.nombre}, manteniendo una cadena de frío estricta directo a tu hogar o negocio en Cali.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl"><CheckCircle2 size={14} /> 100% Fresco</div>
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl"><Clock size={14} /> Cadena de Frío</div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="w-full bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-orange-500 transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    <ShoppingCart size={16} /> Añadir al Carrito
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}