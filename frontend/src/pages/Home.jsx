import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  MessageSquare,
  ShieldCheck,
  ShoppingCart,
  Truck,
  Eye,
  X,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";

// IMPORTACIONES DE IMÁGENES
// @ts-ignore
import hero2 from "../assets/camaronPrecoHero.jpg";
// @ts-ignore
import hero3 from "../assets/Hero2.jpg";
// @ts-ignore
import shirimhero from "../assets/shirimhero.jpg";

//@ts-ignore
import Crustaceos from "../assets/Crustaceos.jpeg";

const HERO_IMAGES = [shirimhero, hero2, hero3, Crustaceos];

export default function Home() {
  const [index, setIndex] = useState(0);

  // ESTADOS DE DATOS
  const [categories, setCategories] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [productosOferta, setProductosOferta] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // NUEVO ESTADO PARA MANEJAR LA VENTANA MODAL DEL DETALLE
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // NUEVOS ESTADOS PARA LA VENTANA MODAL DE CATEGORÍAS Y SUS PRODUCTOS
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingCategoryProducts, setLoadingCategoryProducts] = useState(false);

  // SISTEMA DE CARRITO ORIGINAL
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");

  // CONFIGURACIÓN DE RUTA INTELIGENTE MEJORADA
  const esLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
  
  const BASE_URL = "https://serene-peace-production-62ee.up.railway.app";
  const LOCAL_URL = "http://localhost:8000";
  
  const API_URL = esLocal ? `${LOCAL_URL}/api` : `${BASE_URL}/api`;
  
  const whatsappNumber = "573174262521";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola Expomarket! Me interesa información para mi negocio.")}`;

  // Carrusel automático original
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // CARGA DE DATOS OPTIMIZADA
  useEffect(() => {
    const fetchData = async () => {
      try {
        let resCat = await fetch(`${API_URL}/categorias/`);
        
        if (!resCat.ok && esLocal) {
          resCat = await fetch(`${BASE_URL}/api/categorias/`);
        }

        if (resCat.ok) {
          const dataCat = await resCat.json();
          setCategories(Array.isArray(dataCat) ? dataCat : (dataCat.results || []));
        }

        const currentApi = (!resCat.ok && esLocal) ? `${BASE_URL}/api` : API_URL;

        if (searchTerm) {
          const resSearch = await fetch(`${currentApi}/productos/?search=${searchTerm}`);
          if (resSearch.ok) {
            const dataSearch = await resSearch.json();
            setSearchResults(Array.isArray(dataSearch) ? dataSearch : (dataSearch.results || []));
          }
        } else {
          const resProd = await fetch(`${currentApi}/productos/`);
          if (resProd.ok) {
            const dataProd = await resProd.json();
            const listaGeneral = Array.isArray(dataProd) ? dataProd : (dataProd.results || []);
            setProductosDestacados(listaGeneral.slice(0, 8));
          }

          const resRec = await fetch(`${currentApi}/productos/recomendados/`);
          if (resRec.ok) {
            const dataRec = await resRec.json();
            const listaRecomendados = Array.isArray(dataRec) ? dataRec : (dataRec.results || []);
            setProductosDestacados(listaRecomendados.slice(0, 4));
          }

          const resTodo = await fetch(`${currentApi}/productos/`);
          if (resTodo.ok) {
            const dataTodo = await resTodo.json();
            const listaProductos = Array.isArray(dataTodo) ? dataTodo : (dataTodo.results || []);

            const ofertas = listaProductos.filter(
              (prod) => prod.en_oferta === true || prod.precio_oferta != null,
            );
            setProductosOferta(ofertas.slice(0, 4));
          }
        }
      } catch (error) {
        console.error("Error conectando con Django, reintentando con producción...", error);
        try {
          const resCatProduction = await fetch(`${BASE_URL}/api/categorias/`);
          if (resCatProduction.ok) {
            const dataCat = await resCatProduction.json();
            setCategories(Array.isArray(dataCat) ? dataCat : (dataCat.results || []));
          }
        } catch (err) {
          console.error("Error crítico de red:", err);
        }
      }
    };
    fetchData();
  }, [API_URL, searchTerm]);

  // EFECTO PARA CARGAR LOS PRODUCTOS DE LA CATEGORÍA SELECCIONADA EN EL MODAL
  useEffect(() => {
    if (!selectedCategory) {
      setCategoryProducts([]);
      return;
    }

    const fetchCategoryProducts = async () => {
      setLoadingCategoryProducts(true);
      try {
        // Mismo fallback inteligente (Local -> Railway)
        let response = await fetch(`${API_URL}/productos/?categoria=${selectedCategory.id}`);
        if (!response.ok && esLocal) {
          response = await fetch(`${BASE_URL}/api/productos/?categoria=${selectedCategory.id}`);
        }

        if (response.ok) {
          const data = await response.json();
          setCategoryProducts(Array.isArray(data) ? data : (data.results || []));
        }
      } catch (error) {
        console.error("Error cargando productos de la categoría:", error);
      } finally {
        setLoadingCategoryProducts(false);
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory, API_URL, esLocal]);

  // RESOLUCIÓN DE IMÁGENES ULTRA SEGURA
  const getImageUrl = (url = "") => {
    if (!url) return "https://via.placeholder.com/400x300?text=Expomarket";

    const urlStr = String(url);
    if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
      return urlStr;
    }

    const hostMultimedia = esLocal ? LOCAL_URL : BASE_URL;
    return `${hostMultimedia}${urlStr}`;
  };

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-orange-200">
      {/* HERO ORIGINAL INTACTO */}
      {!searchTerm && (
        <section className="relative h-[90vh] w-full overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={HERO_IMAGES[index]}
                className="h-full w-full object-cover opacity-40"
                alt="Expomar productos del mar"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 flex h-full flex-col md:flex-row items-center justify-center px-8 text-center md:text-left gap-10">
            {/* Texto principal */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                  Frescura que se siente
                </span>
                <span className="block mt-2 text-orange-400">
                  Cada bocado, un placer
                </span>
              </h1>
              <p className="mt-4 text-slate-300 text-lg">
                Productos del mar seleccionados con calidad y sabor inigualable.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/productos"
                  className="rounded-full bg-orange-500 px-8 py-3 font-bold text-white shadow-lg shadow-orange-500/40 hover:bg-orange-600 hover:scale-105 transition-all"
                >
                  🛒 Ver Catálogo
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-green-500 px-8 py-3 font-bold text-white shadow-lg shadow-green-500/40 hover:bg-green-600 hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={22} /> Pedir por WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Imagen lateral con badge */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -top-6 -right-6 bg-orange-500 text-white font-bold rounded-full px-4 py-2 text-sm shadow-lg">
                30% OFF
              </div>
              <img
                src="src/assets/Crustaceos.jpeg"
                alt="Plato de mariscos"
                className="w-[320px] md:w-[400px] rounded-full border-4 border-orange-400 shadow-xl hover:scale-105 transition-transform"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* SECCIÓN DE CARACTERÍSTICAS ORIGINAL */}
      {!searchTerm && (
        <section className="bg-white py-12 border-b">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600">
                <Truck size={30} />
              </div>
              <h3 className="font-bold text-slate-900">Envíos en Cali</h3>
              <p className="text-sm text-slate-500">Llegamos a todo el sur de la ciudad.</p>
            </div>
            <div className="flex flex-col items-center border-x border-slate-100">
              <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600">
                <ShieldCheck size={30} />
              </div>
              <h3 className="font-bold text-slate-900">Calidad Premium</h3>
              <p className="text-sm text-slate-500">Productos seleccionados rigurosamente.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600">
                <Clock size={30} />
              </div>
              <h3 className="font-bold text-slate-900">Cadena de Frío</h3>
              <p className="text-sm text-slate-500">Garantizamos la temperatura ideal.</p>
            </div>
          </div>
        </section>
      )}

      {/* RENDERIZADO DE PRODUCTOS RECOMENDADOS / BÚSQUEDA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900">
              {searchTerm ? `Resultados para: "${searchTerm}"` : "Nuestros Recomendados"}
            </h2>
          </div>
          {searchTerm && (
            <Link to="/" className="text-orange-500 font-bold hover:underline flex items-center gap-2">
              Limpiar búsqueda
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(searchTerm ? searchResults : productosDestacados).map((producto, idx) => (
            <div
              key={producto.id ? `prod-${producto.id}` : `prod-fallback-${idx}`}
              className="group relative rounded-2xl bg-white p-3 border shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden rounded-xl h-64">
                  <img
                    src={getImageUrl(producto.imagen)}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                    alt={producto.nombre}
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={() => setSelectedProduct(producto)}
                      className="bg-white/90 backdrop-blur-xs text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-white transition-all transform scale-90 group-hover:scale-100"
                    >
                      Ver Vista Rápida
                    </button>
                  </div>
                </div>
                <div className="mt-4 p-2 text-center">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{producto.nombre}</h3>
                  <p className="mt-1 text-orange-500 font-bold text-xl">
                    ${producto.precio ? Number(producto.precio).toLocaleString("es-CO") : "0"}{" "}
                    <span className="text-xs text-slate-400">/ Kg</span>
                  </p>
                </div>
              </div>

              <div className="p-2 pt-0 space-y-2">
                <button
                  onClick={() => setSelectedProduct(producto)}
                  className="w-full rounded-xl bg-slate-100 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Eye size={14} /> Detalle Completo
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
      </section>

      {/* SECCIÓN: PRODUCTOS EN OFERTA */}
      {!searchTerm && productosOferta.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 border-t">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-2 block">
                Ahorra Hoy
              </span>
              <h2 className="text-3xl font-black text-slate-900">
                Ofertas Imperdibles 🔥
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {productosOferta.map((producto, idx) => (
              <div
                key={producto.id ? `oferta-${producto.id}` : `oferta-fallback-${idx}`}
                className="group relative rounded-2xl bg-white p-3 border border-orange-100 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="absolute top-5 left-5 z-10 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    Oferta
                  </div>

                  <div className="relative overflow-hidden rounded-xl h-64">
                    <img
                      src={getImageUrl(producto.imagen)}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform"
                      alt={producto.nombre}
                    />
                  </div>
                  <div className="mt-4 p-2 text-center">
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{producto.nombre}</h3>

                    <div className="mt-1 flex items-center justify-center gap-2 font-bold">
                      {producto.precio_oferta ? (
                        <>
                          <span className="text-slate-400 line-through text-sm">
                            ${Number(producto.precio).toLocaleString("es-CO")}
                          </span>
                          <span className="text-orange-600 text-xl">
                            ${Number(producto.precio_oferta).toLocaleString("es-CO")}
                          </span>
                        </>
                      ) : (
                        <span className="text-orange-600 text-xl">
                          ${Number(producto.precio).toLocaleString("es-CO")}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 font-normal">/ Kg</span>
                    </div>
                  </div>
                </div>

                <div className="p-2 pt-0 space-y-2">
                  <button
                    onClick={() => setSelectedProduct(producto)}
                    className="w-full rounded-xl bg-orange-50 text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye size={14} /> Detalle Completo
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
        </section>
      )}

      {/* SECCIÓN DE CATEGORÍAS */}
      {!searchTerm && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 border-t">
          <h2 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-2">Categorías</h2>
          <p className="text-4xl font-extrabold text-slate-900 mb-12">¿Qué se te antoja hoy?</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id ? `cat-${cat.id}` : `cat-fallback-${idx}`}
                whileHover={{ y: -8 }}
                className="relative overflow-hidden rounded-3xl bg-slate-200 h-80 group"
              >
                <img
                  src={getImageUrl(cat.imagen)}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  alt={cat.nombre}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-bold text-white uppercase mb-2">{cat.nombre}</h3>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className="w-full rounded-xl bg-white/90 backdrop-blur-xs text-slate-900 py-2 text-xs font-bold shadow-md hover:bg-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye size={14} /> Vista Rápida Categoría
                    </button>
                    <Link
                      to={`/categoria/${cat.id}`}
                      className="text-orange-400 font-bold text-sm hover:underline text-center"
                    >
                      Ver selección premium →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* BANNER B2B ORIGINAL */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <div className="flex-1 z-10">
            <span className="text-orange-500 font-bold uppercase text-sm">Expomarket</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6">¿Surtimos tu negocio?</h2>
            <p className="text-slate-400 mb-8 max-w-md">
              Precios especiales para restaurantes y pescaderías en Cali. Calidad y cumplimiento garantizado.
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

      {/* MODAL DETALLE DE CATEGORÍA CON SUS RESPECTIVOS PRODUCTOS INTERNOS */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              className="absolute inset-0" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCategory(null)}
            />

            <motion.div 
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden z-10 border border-slate-100 max-h-[85vh] flex flex-col"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
            >
              {/* Botón Cerrar */}
              <button 
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 z-20 bg-slate-100 text-slate-600 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>

              {/* Encabezado del Modal */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-xs flex-shrink-0">
                  <img src={getImageUrl(selectedCategory.imagen)} alt={selectedCategory.nombre} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Catálogo de Categoría</span>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">{selectedCategory.nombre}</h2>
                </div>
              </div>

              {/* Cuerpo del Modal Escusable con los Productos */}
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
                {loadingCategoryProducts ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium">Buscando las mejores opciones...</p>
                  </div>
                ) : categoryProducts.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <p className="font-medium">No hay productos disponibles en esta categoría en este momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map((producto, idx) => (
                      <div
                        key={producto.id ? `cat-prod-${producto.id}` : `cat-prod-fallback-${idx}`}
                        className="group relative rounded-2xl bg-white p-3 border shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative overflow-hidden rounded-xl h-44">
                            <img
                              src={getImageUrl(producto.imagen)}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                              alt={producto.nombre}
                            />
                            {producto.precio_oferta && (
                              <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                                Oferta
                              </div>
                            )}
                          </div>
                          <div className="mt-3 p-1 text-center">
                            <h4 className="font-bold text-slate-800 line-clamp-1">{producto.nombre}</h4>
                            <div className="mt-1 flex items-center justify-center gap-1.5 font-bold text-sm">
                              {producto.precio_oferta ? (
                                <>
                                  <span className="text-slate-400 line-through text-xs">
                                    ${Number(producto.precio).toLocaleString("es-CO")}
                                  </span>
                                  <span className="text-orange-600 text-base">
                                    ${Number(producto.precio_oferta).toLocaleString("es-CO")}
                                  </span>
                                </>
                              ) : (
                                <span className="text-orange-600 text-base">
                                  ${Number(producto.precio).toLocaleString("es-CO")}
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 font-normal">/ Kg</span>
                            </div>
                          </div>
                        </div>

                        {/* Botones de acción dentro del modal de categorías */}
                        <div className="p-1 pt-2 space-y-1.5">
                          <button
                            onClick={() => {
                              setSelectedProduct(producto); // Abre el modal de detalle del producto
                            }}
                            className="w-full rounded-lg bg-slate-100 py-1.5 text-[11px] font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1"
                          >
                            <Eye size={12} /> Ver Detalle
                          </button>
                          <button
                            onClick={() => addToCart(producto)}
                            className="w-full rounded-lg bg-slate-900 py-2 text-xs font-bold text-white hover:bg-orange-500 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <ShoppingCart size={14} /> Añadir
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer del Modal */}
              <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                <Link
                  to={`/categoria/${selectedCategory.id}`}
                  onClick={() => setSelectedCategory(null)}
                  className="bg-slate-900 hover:bg-orange-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors shadow-sm"
                >
                  Ir a la página de la categoría →
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* VENTANA MODAL DE DETALLE COMPLETO DEL PRODUCTO */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md">
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
                className="absolute top-4 right-4 z-20 bg-slate-100 text-slate-600 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors shadow-xs"
              >
                <X size={18} />
              </button>

              <div className="w-full lg:w-1/2 h-64 lg:h-auto relative bg-slate-100">
                <img 
                  src={getImageUrl(selectedProduct.imagen)} 
                  alt={selectedProduct.nombre} 
                  className="w-full h-full object-cover"
                />
                {selectedProduct.precio_oferta && (
                  <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-black px-3 py-1 rounded-full uppercase">
                    Oferta Especial
                  </div>
                )}
              </div>

              <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                      Categoría Premium
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                      {selectedProduct.nombre}
                    </h2>
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
                    <span className="text-xs font-bold text-slate-500 bg-white border px-3 py-1 rounded-lg">
                      Calidad de Exportación
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Descripción del Producto
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {selectedProduct.descripcion || 
                        `Disfruta de la frescura inigualable de nuestro ${selectedProduct.nombre}. Seleccionado rigurosamente bajo los más altos estándares internacionales, garantizando una cadena de frío estricta directo a tu hogar o negocio en Cali.`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-xl">
                      <CheckCircle2 size={14} /> 100% Fresco
                    </div>
                    <div className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl">
                      <Clock size={14} /> Cadena de Frío
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-orange-500 transition-colors flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    <ShoppingCart size={16} /> Añadir al Carrito
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}