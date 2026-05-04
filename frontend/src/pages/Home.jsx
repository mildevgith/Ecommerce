import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  MessageSquare,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Importación del carrito

// Importamos las imágenes locales para el Hero
import hero2 from "../assets/camaronPrecoHero.jpg";
import hero3 from "../assets/Hero2.jpg";
import shirimhero from "../assets/shirimhero.jpg";

const HERO_IMAGES = [shirimhero, hero2, hero3];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const { addToCart } = useCart(); // Hook del carrito
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");

  const BASE_URL = "https://serene-peace-production-62ee.up.railway.app";
  const API_URL = `${BASE_URL}/api`;
  const whatsappNumber = "573174262521";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola Expomarket! Me interesa información para mi negocio.")}`;

  // Carrusel automático
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch de datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCat = await fetch(`${API_URL}/categorias/`);
        const dataCat = await resCat.json();
        setCategories(dataCat);

        if (searchTerm) {
          const resSearch = await fetch(
            `${API_URL}/productos/?search=${searchTerm}`,
          );
          const dataSearch = await resSearch.json();
          setSearchResults(dataSearch);
        } else {
          const resProd = await fetch(`${API_URL}/productos/`);
          const dataProd = await resProd.json();
          const destacados = dataProd.filter((p) => p.es_destacado === true);
          setProductosDestacados(
            destacados.length > 0
              ? destacados.slice(0, 4)
              : dataProd.slice(0, 4),
          );
        }
      } catch (error) {
        console.error("Error conectando con Django:", error);
      }
    };
    fetchData();
  }, [API_URL, searchTerm]);

  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x300?text=Expomarket";
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-orange-200">
      {!searchTerm && (
        <section className="relative h-[95vh] w-full overflow-hidden bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={HERO_IMAGES[index]}
                className="h-full w-full object-cover opacity-60"
                alt="Expomarket"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl"
            >
              Frescura que se <br />
              <span className="bg-linear-to-t from-orange-400 to-amber-600 bg-clip-text text-transparent">
                siente en cada bocado
              </span>
            </motion.h1>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/productos"
                className="rounded-full bg-orange-500 px-10 py-4 font-extrabold text-white shadow-lg shadow-orange-500/40 hover:bg-orange-600 hover:scale-105 transition-all text-lg"
              >
                🛒 Ver Catálogo
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-green-500 px-10 py-4 font-extrabold text-white shadow-lg shadow-green-500/40 hover:bg-green-600 hover:scale-105 transition-all text-lg flex items-center justify-center gap-2"
              >
                <MessageSquare size={22} /> Pedir por WhatsApp
              </a>
            </motion.div>
          </div>
        </section>
      )}

      {!searchTerm && (
        <section className="bg-white py-12 border-b">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600">
                <Truck size={30} />
              </div>
              <h3 className="font-bold text-slate-900">Envíos en Cali</h3>
              <p className="text-sm text-slate-500">
                Llegamos a todo el sur de la ciudad.
              </p>
            </div>
            <div className="flex flex-col items-center border-x border-slate-100">
              <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600">
                <ShieldCheck size={30} />
              </div>
              <h3 className="font-bold text-slate-900">Calidad Premium</h3>
              <p className="text-sm text-slate-500">
                Productos seleccionados rigurosamente.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600">
                <Clock size={30} />
              </div>
              <h3 className="font-bold text-slate-900">Cadena de Frío</h3>
              <p className="text-sm text-slate-500">
                Garantizamos la temperatura ideal.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              {searchTerm
                ? `Resultados para: "${searchTerm}"`
                : "Nuestros Recomendados"}
            </h2>
          </div>
          {searchTerm && (
            <Link
              to="/"
              className="text-orange-500 font-bold hover:underline flex items-center gap-2"
            >
              Limpiar búsqueda
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(searchTerm ? searchResults : productosDestacados).map(
            (producto) => (
              <div
                key={producto.id}
                className="group relative rounded-2xl bg-white p-3 border shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative overflow-hidden rounded-xl h-64">
                  <img
                    src={getImageUrl(producto.imagen)}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                    alt={producto.nombre}
                  />
                </div>
                <div className="mt-4 p-2 text-center">
                  <h3 className="text-lg font-bold text-slate-800">
                    {producto.nombre}
                  </h3>
                  <p className="mt-1 text-orange-500 font-bold text-xl">
                    ${Number(producto.precio).toLocaleString("es-CO")}{" "}
                    <span className="text-xs text-slate-400">/ Kg</span>
                  </p>
                  {/* BOTÓN CONECTADO AL CARRITO */}
                  <button
                    onClick={() => addToCart(producto)}
                    className="mt-4 w-full rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} /> Añadir al carrito
                  </button>
                </div>
              </div>
            ),
          )}
        </div>
      </section>

      {/* Resto de secciones (Categorías, Banner) se mantienen igual... */}
      {!searchTerm && (
        <section className="mx-auto max-w-7xl px-6 py-12 border-t">
          <h2 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-2">
            Categorías
          </h2>
          <p className="text-4xl font-extrabold text-slate-900 mb-12">
            ¿Qué se te antoja hoy?
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                whileHover={{ y: -8 }}
                className="relative overflow-hidden rounded-3xl bg-slate-200 h-80 group"
              >
                <img
                  src={getImageUrl(cat.imagen)}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  alt={cat.nombre}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white uppercase">
                    {cat.nombre}
                  </h3>
                  <Link
                    to={`/categoria/${cat.id}`}
                    className="text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Ver selección premium →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <div className="flex-1 z-10">
            <span className="text-orange-500 font-bold uppercase text-sm">
              {" "}
              Expomarket
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6">
              ¿Surtimos tu negocio?
            </h2>
            <p className="text-slate-400 mb-8 max-w-md">
              Precios especiales para restaurantes y pescaderías en Cali.
              Calidad y cumplimiento garantizado.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all"
            >
              <MessageSquare size={20} /> Hablar con un asesor
            </a>
          </div>
          <div className="flex-1 relative">
            <div className="w-64 h-64 bg-orange-500/20 rounded-full blur-3xl absolute -top-10 -right-10"></div>
            <img
              src={shirimhero}
              className="rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
              alt="Suministro B2B"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
