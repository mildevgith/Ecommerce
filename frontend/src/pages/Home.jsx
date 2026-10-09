import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  Eye,
  MessageSquare,
  ShieldCheck,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../axios";
import { useCart } from "../context/CartContext";

export default function Home() {
  const [index, setIndex] = useState(0);

  // ESTADOS DE DATOS Y BANNERS DINÁMICOS
  const [banners, setBanners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [productosOferta, setProductosOferta] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  // ESTADOS PARA MODALES
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingCategoryProducts, setLoadingCategoryProducts] = useState(false);

  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");

  const whatsappNumber = "573174262521";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola Expomarket! Me interesa información para mi negocio.")}`;

  // RESOLUCIÓN DE URLS DE IMÁGENES (Local y Producción)
  const getImageUrl = (url = "") => {
    if (!url) return "https://via.placeholder.com/400x300?text=Expomarket";
    const urlStr = String(url);
    if (urlStr.startsWith("http://") || urlStr.startsWith("https://")) {
      return urlStr;
    }
    const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
    return `${baseURL}${urlStr}`;
  };

  // Carrusel automático basado en los banners de la base de datos
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners]);

  // CARGA DE DATOS DESDE EL BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Cargar Banners Dinámicos desde Django
        const resBanners = await api.get('/banners/');
        const dataBanners = resBanners.data;
        const bannerList = Array.isArray(dataBanners) ? dataBanners : (dataBanners.results || []);
        setBanners(bannerList);

        // 2. Cargar Categorías
        const resCat = await api.get('/categorias/');
        const dataCat = resCat.data;
        setCategories(Array.isArray(dataCat) ? dataCat : (dataCat.results || []));

        if (searchTerm) {
          const resSearch = await api.get(`/productos/?search=${searchTerm}`);
          const dataSearch = resSearch.data;
          setSearchResults(Array.isArray(dataSearch) ? dataSearch : (dataSearch.results || []));
        } else {
          const resProd = await api.get('/productos/');
          const listaGeneral = Array.isArray(resProd.data) ? resProd.data : (resProd.data.results || []);
          setProductosDestacados(listaGeneral.slice(0, 8));

          try {
            const resRec = await api.get('/productos/recomendados/');
            const listaRecomendados = Array.isArray(resRec.data) ? resRec.data : (resRec.data.results || []);
            if (listaRecomendados.length > 0) {
              setProductosDestacados(listaRecomendados.slice(0, 4));
            }
          } catch (e) {
            console.log("Endpoint recomendados no disponible, usando generales.");
          }

          const ofertas = listaGeneral.filter(
            (prod) => prod.en_oferta === true || prod.precio_oferta != null
          );
          setProductosOferta(ofertas.slice(0, 4));
        }
      } catch (error) {
        console.error("Error conectando con el backend:", error);
      }
    };

    fetchData();
  }, [searchTerm]);

  // CARGAR PRODUCTOS DE CATEGORÍA SELECCIONADA
  useEffect(() => {
    if (!selectedCategory) {
      setCategoryProducts([]);
      return;
    }

    const fetchCategoryProducts = async () => {
      setLoadingCategoryProducts(true);
      try {
        const response = await api.get(`/productos/?categoria=${selectedCategory.id}`);
        const data = response.data;
        setCategoryProducts(Array.isArray(data) ? data : (data.results || []));
      } catch (error) {
        console.error("Error cargando productos de la categoría:", error);
      } finally {
        setLoadingCategoryProducts(false);
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-orange-200">
      {/* HERO DINÁMICO CONTROLADO DESDE DJANGO */}
      {!searchTerm && banners.length > 0 && (
        <section className="relative h-[90vh] w-full overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 flex items-center justify-center px-8"
            >
              {/* Imagen de fondo del banner actual */}
              <img
                src={getImageUrl(banners[index]?.imagen)}
                className="absolute inset-0 h-full w-full object-cover opacity-40"
                alt={banners[index]?.titulo || "Expomarket Banner"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

              <div className="relative z-10 flex h-full w-full max-w-7xl flex-col md:flex-row items-center justify-between gap-10">
                {/* Texto principal dinámico del banner */}
                <div className="max-w-xl text-center md:text-left">
                  <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-600">
                      {banners[index]?.titulo || "Frescura que se siente en"}
                    </span>
                    <span className="block mt-2 text-orange-400">
                      {banners[index]?.descripcion || "Cada bocado"}
                    </span>
                  </h1>
                  <p className="mt-4 text-slate-300 text-lg">
                    Productos del mar seleccionados con calidad y sabor inigualable.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
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
                </div>

                {/* Imagen lateral del banner */}
                <div className="relative hidden md:block">
                  <div className="absolute -top-6 -right-6 bg-orange-500 text-white font-bold rounded-full px-4 py-2 text-sm shadow-lg z-20">
                    30% OFF
                  </div>
                  <img
                    src={getImageUrl(banners[index]?.imagen)}
                    alt="Plato destacado"
                    className="w-[320px] md:w-[400px] h-[400px] object-cover rounded-full border-4 border-orange-400 shadow-xl"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {/* SECCIÓN DE CARACTERÍSTICAS */}
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

      {/* PRODUCTOS RECOMENDADOS / BÚSQUEDA */}
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

      {/* SECCIÓN: OFERTAS */}
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

      {/* CATEGORÍAS */}
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

      {/* MODALES DE CATEGORÍAS Y PRODUCTOS (INCLUIDOS PARA MANTENER LA FUNCIONALIDAD) */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div className="absolute inset-0" onClick={() => setSelectedCategory(null)} />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden z-10 border border-slate-100 max-h-[85vh] flex flex-col">
              <button onClick={() => setSelectedCategory(null)} className="absolute top-4 right-4 z-20 bg-slate-100 text-slate-600 p-2 rounded-full hover:bg-orange-500 hover:text-white transition-colors">
                <X size={18} />
              </button>
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-xs flex-shrink-0">
                  <img src={getImageUrl(selectedCategory.imagen)} alt={selectedCategory.nombre} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">Catálogo de Categoría</span>
                  <h2 className="text-2xl font-black text-slate-900 uppercase">{selectedCategory.nombre}</h2>
                </div>
              </div>
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50/30">
                {loadingCategoryProducts ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                    <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : categoryProducts.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">No hay productos en esta categoría.</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryProducts.map((producto, idx) => (
                      <div key={producto.id || idx} className="bg-white p-3 border rounded-2xl flex flex-col justify-between">
                        <div>
                          <img src={getImageUrl(producto.imagen)} alt={producto.nombre} className="h-44 w-full object-cover rounded-xl" />
                          <h4 className="font-bold mt-2 text-slate-800">{producto.nombre}</h4>
                          <p className="text-orange-600 font-bold">${Number(producto.precio).toLocaleString("es-CO")}</p>
                        </div>
                        <button onClick={() => addToCart(producto)} className="mt-3 bg-slate-900 text-white py-2 rounded-xl text-xs font-bold hover:bg-orange-500 transition-colors">
                          Añadir
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden z-10 flex flex-col lg:flex-row max-h-[90vh]">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-20 bg-slate-100 p-2 rounded-full hover:bg-orange-500 hover:text-white">
                <X size={18} />
              </button>
              <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-slate-100">
                <img src={getImageUrl(selectedProduct.imagen)} alt={selectedProduct.nombre} className="w-full h-full object-cover" />
              </div>
              <div className="w-full lg:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-3xl font-black text-slate-900">{selectedProduct.nombre}</h2>
                  <p className="text-2xl font-black text-slate-900 mt-4">${Number(selectedProduct.precio).toLocaleString("es-CO")}</p>
                  <p className="text-sm text-slate-600 mt-2">{selectedProduct.descripcion || "Sin descripción detallada."}</p>
                </div>
                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full bg-slate-900 text-white py-3 font-bold rounded-xl hover:bg-orange-500 transition-colors mt-6">
                  Añadir al carrito
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
