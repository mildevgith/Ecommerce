import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import mix from "../assets/mix.jpeg";
// 1. IMPORTAMOS EL HOOK DEL CARRITO
import { useCart } from "../context/CartContext";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // 2. EXTRAEMOS LA FUNCIÓN addToCart
  const { addToCart } = useCart();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("search") || "";

  useEffect(() => {
    const obtenerProductos = async () => {
      setLoading(true);
      try {
        const base_url = "http://localhost:8000/api/productos/";
        const url = searchTerm
          ? `${base_url}?search=${encodeURIComponent(searchTerm)}`
          : base_url;

        const response = await axios.get(url);
        setProductos(response.data);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error al conectar con la base de datos:", error);
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
          <div className="text-center py-10">Cargando productos...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProducts.map((producto) => (
                <div key={producto.id} className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all group">
                  <img src={producto.imagen} alt={producto.nombre} className="w-full h-56 object-cover" />
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>
                    <p className="text-blue-900 text-lg font-semibold mb-4">${producto.precio.toLocaleString("es-CO")}</p>

                    <div className="flex justify-between gap-2">
                      {/* 3. CAMBIAMOS EL Link POR UN button CON addToCart */}
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

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`px-4 py-2 rounded-full border border-blue-600 ${currentPage === num ? "bg-blue-600 text-white" : "text-blue-600"}`}
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
