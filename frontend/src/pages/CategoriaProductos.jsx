import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

// URL base de tu backend de Django
const BASE_URL = "http://localhost:8000";

// Corrección para resolver rutas relativas o absolutas de imágenes dinámicamente
const getImageUrl = (url) => {
  if (!url) return "https://via.placeholder.com/400x300?text=Expomarket";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${BASE_URL}${url}`;
};

export default function CategoriaProductos() {
  const { id } = useParams(); // Captura el ID de la URL (ej: /categoria/2)
  const { addToCart } = useCart();

  const [categoria, setCategoria] = useState({ nombre: "" });
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      setLoading(true);
      try {
        // 1. Obtener la información básica de la categoría (para el nombre del encabezado)
        const catRes = await fetch(`${BASE_URL}/api/categorias/${id}/`);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategoria(catData);
        }

        // 2. Obtener los productos que pertenecen a esta categoría con el endpoint limpio
        const prodRes = await fetch(
          `${BASE_URL}/api/categorias/${id}/productos/`,
        );
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          // Al quitarle la paginación a este endpoint en Django, prodData será siempre un Array []
          setProductos(
            Array.isArray(prodData) ? prodData : prodData.results || [],
          );
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
  }, [id]);

  if (loading) {
    return (
      <div className="text-center p-10 font-bold text-slate-600">
        Cargando productos de la categoría...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón para regresar a la página principal */}
      <Link
        to="/"
        className="inline-flex items-center text-orange-500 hover:underline mb-6 gap-2"
      >
        <ArrowLeft size={18} /> Volver al Inicio
      </Link>

      {/* Encabezado Principal */}
      <div className="mb-8">
        <span className="text-xs font-bold text-orange-500 tracking-wider uppercase">
          Categoría
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 uppercase">
          {categoria?.nombre || "MOLUSCOS"}
        </h1>
        <p className="text-slate-500 mt-1">
          {productos.length}{" "}
          {productos.length === 1
            ? "producto disponible"
            : "productos disponibles"}
        </p>
      </div>

      {/* Rejilla de productos */}
      {productos.length === 0 ? (
        <div className="border border-slate-200 rounded-2xl p-12 text-center bg-white shadow-sm">
          <p className="text-slate-400">
            No hay productos disponibles en esta categoría en este momento.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="group relative rounded-2xl bg-white p-3 border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              {/* Imagen del producto */}
              <div className="relative overflow-hidden rounded-xl h-64 bg-slate-50">
                <img
                  src={getImageUrl(producto.imagen)}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  alt={producto.nombre}
                />
              </div>

              {/* Información y Precio */}
              <div className="mt-4 p-2 text-center">
                <h3 className="text-lg font-bold text-slate-800">
                  {producto.nombre}
                </h3>
                <p className="text-xs text-slate-400 min-h-[32px] mt-1 line-clamp-2">
                  {producto.descripcion}
                </p>
                <p className="mt-2 text-orange-500 font-bold text-xl">
                  $
                  {producto.precio
                    ? Number(producto.precio).toLocaleString("es-CO")
                    : "0"}
                  <span className="text-xs text-slate-400 font-normal">
                    {" "}
                    / Kg
                  </span>
                </p>

                {/* Botón de agregar al carrito */}
                <button
                  onClick={() => addToCart(producto)}
                  className="mt-4 w-full rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} /> Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
