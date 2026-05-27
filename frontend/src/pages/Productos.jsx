import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import mix from "../assets/mix.jpeg";
import { useCart } from "../context/CartContext";

export default function Productos() {
  const [productos, setProductos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const { addToCart } = useCart();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  // DETECCIÓN AUTOMÁTICA DE ENTORNO (Casa vs Empresa)
  const esLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
  
  const BASE_URL = esLocal 
    ? "http://localhost:8000" 
    : "https://serene-peace-production-62ee.up.railway.app";

  useEffect(() => {
    const obtenerProductos = async () => {
      setLoading(true);
      try {
        // Renderiza dinámicamente según el entorno activo sin romper Netlify
        const base_url = `${BASE_URL}/api/productos/`;
        const url = searchTerm
          ? `${base_url}?search=${encodeURIComponent(searchTerm)}`
          : base_url;

        const response = await axios.get(url);
        
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
  }, [searchTerm, BASE_URL]);

  // Lógica de paginación segura
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  
  const currentProducts = productos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(productos.length / productsPerPage);

  // RESOLUCIÓN DE IMÁGENES CONTROLADA
  const getImageUrl = (url = "") => {
    if (!url) return "https://via.placeholder.com/400x300?text=Expomarket";
    
    const urlStr = String(url);
    if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
      return urlStr;
    }
    return `${BASE_URL}${urlStr}`;
  };

  return (
    <>
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden shadow-md">
        <img src={mix} alt="Productos frescos" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Productos frescos directamente del mar
          </h1>
        </div>
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 150" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M0,32L1440,64L1440,150L0,150Z"></path>
        </svg>
      </section>

      <section className="container mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-blue-900 mb-10">
          {searchTerm ? `Resultados para: "${searchTerm}"` : "Catálogo de Productos"}
        </h2>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            <p className="mt-4 text-gray-500 font-medium">Cargando delicias del mar...</p>
          </div>
        ) : (
          <>
            {productos.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  No se encontraron productos disponibles.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentProducts.map((producto) => (
                    <div key={producto.id} className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all group">
                    <img 
                        src={getImageUrl(producto.imagen)} 
                        alt={producto.nombre} 
                        className="w-full h-56 object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+No+Disponible'; }} 
                    />
                    <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>
                        <p className="text-blue-900 text-lg font-semibold mb-4">
                            ${Number(producto.precio).toLocaleString("es-CO")}
                        </p>

                        <div className="flex justify-between gap-2">
                        <button
                            onClick={() => addToCart(producto)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-orange-500 transition-colors flex-1"
                        >
                            Añadir al carrito
                        </button>

                        <Link to={`/productoDetalle/${producto.id}`} className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-xs hover:bg-blue-600 hover:text-white transition">
                            Detalles
                        </Link>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                        setCurrentPage(num);
                        window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    className={`px-4 py-2 rounded-full border border-blue-600 transition-colors ${currentPage === num ? "bg-blue-600 text-white" : "text-blue-600 hover:bg-blue-50"}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}