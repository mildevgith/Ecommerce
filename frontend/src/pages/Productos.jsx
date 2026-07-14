// src/pages/Productos.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import mix from "../assets/mix.jpeg";
import { useCart } from "../context/CartContext";

export default function Productos() {
  const [productos, setProductos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Estado para controlar el Modal del producto seleccionado
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

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

                        {/* Ahora en lugar de un <Link>, abre el modal asignando el producto actual al estado */}
                        <button 
                            onClick={() => setProductoSeleccionado(producto)}
                            className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-xs hover:bg-blue-600 hover:text-white transition cursor-pointer"
                        >
                            Detalles
                        </button>
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

      {/* MODAL DE DETALLE DEL PRODUCTO */}
      {productoSeleccionado && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setProductoSeleccionado(null)} // Cierra al hacer clic fuera
        >
          <div 
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-up"
            onClick={(e) => e.stopPropagation()} // Evita cerrar si se hace clic dentro del modal
          >
            {/* Botón X para cerrar */}
            <button 
              onClick={() => setProductoSeleccionado(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer z-10"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Imagen en el Modal */}
              <div className="md:w-1/2 h-64 md:h-auto min-h-[250px] bg-gray-100">
                <img 
                  src={getImageUrl(productoSeleccionado.imagen)} 
                  alt={productoSeleccionado.nombre} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+No+Disponible'; }}
                />
              </div>

              {/* Contenido/Información en el Modal */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">{productoSeleccionado.nombre}</h2>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">{productoSeleccionado.descripcion || "Sin descripción adicional."}</p>
                  
                  {/* Stock si viene de tu backend */}
                  {productoSeleccionado.stock !== undefined && (
                    <p className="text-xs font-semibold text-gray-500 mb-4">
                      Disponibles: <span className="text-blue-900">{productoSeleccionado.stock} unidades</span>
                    </p>
                  )}
                  
                  <p className="text-blue-900 text-2xl font-bold mb-6">
                    ${Number(productoSeleccionado.precio).toLocaleString("es-CO")}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      addToCart(productoSeleccionado);
                      setProductoSeleccionado(null); // Cierra automáticamente tras añadir
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-orange-500 transition-colors flex-1"
                  >
                    Añadir al carrito
                  </button>
                  <button
                    onClick={() => setProductoSeleccionado(null)}
                    className="border border-gray-300 text-gray-600 px-4 py-3 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}