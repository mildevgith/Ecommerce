import { AnimatePresence, motion } from "framer-motion";
import {
  Clock,
  Eye,
  MessageSquare,
  ShieldCheck,
  ShoppingCart,
  Truck,
  X,
  Sparkles,
  CheckCircle,
  Globe,
  MapPin,
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
        const resBanners = await api.get('/banners/');
        const dataBanners = resBanners.data;
        const bannerList = Array.isArray(dataBanners) ? dataBanners : (dataBanners.results || []);
        setBanners(bannerList);

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

  // CARGAR PRODUCTOS DE CATEGORÍA SELECCIONADA (Si no es transporte)
  useEffect(() => {
    if (!selectedCategory) {
      setCategoryProducts([]);
      return;
    }

    const catName = (selectedCategory.nombre || "").toLowerCase();
    const isTransport = catName.includes("transporte") || catName.includes("logística") || catName.includes("fletes");

    if (isTransport) {
      setLoadingCategoryProducts(false);
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

  const isTransportCategory = (cat) => {
    if (!cat) return false;
    const name = (cat.nombre || "").toLowerCase();
    return name.includes("transporte") || name.includes("logística") || name.includes("fletes");
  };

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-orange-200">
      {/*HERO DINÁMICO*/}
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

            {/* Imagen lateral dinámica (toma el siguiente banner o el primero) */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative mt-6 md:mt-0 block md:block"
            >
              <div className="absolute -top-6 -right-6 bg-orange-500 text-white font-bold rounded-full px-4 py-2 text-sm shadow-lg z-20">
                30% OFF
              </div>

              <img
                src={getImageUrl(banners[index]?.imagen)}
                className="absolute inset-0 h-full w-full object-cover opacity-40"
                alt={banners[index]?.titulo || "Expomarket Banner"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

              <div className="relative z-10 flex h-full w-full max-w-7xl flex-col md:flex-row items-center justify-between gap-10">
                <div className="max-w-xl text-center md:text-left">
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#DE6E28]/20 border border-[#DE6E28]/40 text-orange-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md mb-4">
                    <Sparkles className="w-3.5 h-3.5" /> Exclusivo en Cali
                  </span>
                  <h1 className="text-5xl md:text-6xl font-black text-white leading-tight">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                      {banners[index]?.titulo || "Frescura que se siente en"}
                    </span>
                    <span className="block mt-2 text-orange-400">
                      {banners[index]?.descripcion || "Cada bocado"}
                    </span>
                  </h1>
                  <p className="mt-4 text-slate-300 text-lg font-medium">
                    Productos del mar seleccionados con calidad y sabor inigualable.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                    <Link
                      to="/productos"
                      className="rounded-2xl bg-[#DE6E28] px-8 py-3.5 font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-[#c55d1f] hover:scale-105 transition-all text-center"
                    >
                      🛒 Ver Catálogo
                    </Link>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-2xl bg-emerald-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 hover:scale-105 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={20} /> Pedir por WhatsApp
                    </a>
                  </div>
                </div>

                <div className="relative hidden md:block">
                  <div className="absolute -top-6 -right-6 bg-[#DE6E28] text-white font-black rounded-full px-4 py-2 text-sm shadow-lg z-20">
                    30% OFF
                  </div>
                  <img
                    src={getImageUrl(banners[index]?.imagen)}
                    alt="Plato destacado"
                    className="w-[320px] md:w-[400px] h-[400px] object-cover rounded-full border-4 border-[#DE6E28] shadow-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {/* SECCIÓN DE CARACTERÍSTICAS */}
      {!searchTerm && (
        <section className="bg-white py-12 border-b border-gray-100 shadow-xs">
          <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-orange-50 rounded-2xl text-[#DE6E28]">
                <Truck size={28} />
              </div>
              <h3 className="font-bold text-[#242A57]">Envíos en Cali</h3>
              <p className="text-sm text-gray-500 mt-1">Llegamos a todo el sur y la ciudad.</p>
            </div>
            <div className="flex flex-col items-center border-x border-gray-100">
              <div className="mb-4 p-3 bg-orange-50 rounded-2xl text-[#DE6E28]">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-bold text-[#242A57]">Calidad Premium</h3>
              <p className="text-sm text-gray-500 mt-1">Productos seleccionados rigurosamente.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="mb-4 p-3 bg-orange-50 rounded-2xl text-[#DE6E28]">
                <Clock size={28} />
              </div>
              <h3 className="font-bold text-[#242A57]">Cadena de Frío</h3>
              <p className="text-sm text-gray-500 mt-1">Garantizamos la temperatura ideal.</p>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTOS RECOMENDADOS / BÚSQUEDA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#DE6E28] block mb-1">Selección Especial</span>
            <h2 className="text-3xl font-black text-[#242A57]">
              {searchTerm ? `Resultados para: "${searchTerm}"` : "Nuestros Recomendados"}
            </h2>
          </div>
          {searchTerm && (
            <Link to="/" className="text-[#DE6E28] font-bold hover:underline flex items-center gap-2">
              Limpiar búsqueda
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {(searchTerm ? searchResults : productosDestacados).map((producto, idx) => (
            <div
              key={producto.id ? `prod-${producto.id}` : `prod-fallback-${idx}`}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative overflow-hidden h-64 bg-gray-100">
                  <img
                    src={getImageUrl(producto.imagen)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt={producto.nombre}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <button
                      onClick={() => setSelectedProduct(producto)}
                      className="w-full bg-white/90 backdrop-blur-md text-[#242A57] py-2 rounded-xl text-xs font-extrabold shadow-md hover:bg-white transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye size={14} /> Vista Rápida
                    </button>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#242A57] text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                    Fresco
                  </div>
                </div>

                <div className="p-6 pb-2">
                  <h3 className="text-lg font-black text-[#242A57] group-hover:text-[#DE6E28] transition-colors line-clamp-1">{producto.nombre}</h3>
                  <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">
                    {producto.descripcion || "Selección marina de alta calidad para tu mesa."}
                  </p>
                  <p className="mt-3 text-[#242A57] font-black text-xl">
                    ${producto.precio ? Number(producto.precio).toLocaleString("es-CO") : "0"}{" "}
                    <span className="text-xs text-gray-400 font-bold">/ lb o kg</span>
                  </p>
                </div>
              </div>

              <div className="p-6 pt-3 space-y-2.5">
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(producto)}
                    className="flex-1 bg-[#242A57] text-white py-3 rounded-2xl text-xs font-extrabold hover:bg-[#DE6E28] transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} /> Añadir
                  </button>
                  <button
                    onClick={() => setSelectedProduct(producto)}
                    className="px-4 py-3 rounded-2xl text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
                  >
                    Detalles
                  </button>
                </div>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola Expomarket! Me interesa información sobre Ventas Mayoristas para el producto: ${producto.nombre}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 text-white py-3 rounded-2xl text-xs font-extrabold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageSquare size={16} /> Ventas Mayoristas
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN: OFERTAS */}
      {!searchTerm && productosOferta.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 border-t border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#DE6E28] mb-1 block">
                Ahorra Hoy
              </span>
              <h2 className="text-3xl font-black text-[#242A57]">
                Ofertas Imperdibles 🔥
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {productosOferta.map((producto, idx) => (
              <div
                key={producto.id ? `oferta-${producto.id}` : `oferta-fallback-${idx}`}
                className="group bg-white rounded-3xl overflow-hidden border border-orange-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative overflow-hidden h-64 bg-gray-100">
                    <div className="absolute top-4 left-4 z-10 bg-[#DE6E28] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Oferta
                    </div>
                    <img
                      src={getImageUrl(producto.imagen)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      alt={producto.nombre}
                    />
                  </div>
                  <div className="p-6 pb-2">
                    <h3 className="text-lg font-black text-[#242A57] group-hover:text-[#DE6E28] transition-colors line-clamp-1">{producto.nombre}</h3>
                    <div className="mt-3 flex items-baseline gap-2 font-bold">
                      {producto.precio_oferta ? (
                        <>
                          <span className="text-gray-400 line-through text-xs font-semibold">
                            ${Number(producto.precio).toLocaleString("es-CO")}
                          </span>
                          <span className="text-[#DE6E28] text-2xl font-black">
                            ${Number(producto.precio_oferta).toLocaleString("es-CO")}
                          </span>
                        </>
                      ) : (
                        <span className="text-[#DE6E28] text-2xl font-black">
                          ${Number(producto.precio).toLocaleString("es-CO")}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 font-bold">/ lb o kg</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-3 space-y-2.5">
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(producto)}
                      className="flex-1 bg-[#242A57] text-white py-3 rounded-2xl text-xs font-extrabold hover:bg-[#DE6E28] transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={16} /> Añadir
                    </button>
                    <button
                      onClick={() => setSelectedProduct(producto)}
                      className="px-4 py-3 rounded-2xl text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all"
                    >
                      Detalles
                    </button>
                  </div>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola Expomarket! Me interesa información sobre Ventas Mayoristas para el producto en oferta: ${producto.nombre}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 text-white py-3 rounded-2xl text-xs font-extrabold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageSquare size={16} /> Ventas Mayoristas
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CATEGORÍAS */}
      {!searchTerm && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 border-t border-gray-100">
          <span className="text-xs font-black uppercase tracking-widest text-[#DE6E28] mb-1 block">Explora por Tipo</span>
          <h2 className="text-3xl font-black text-[#242A57] mb-10">¿Qué se te antoja hoy?</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id ? `cat-${cat.id}` : `cat-fallback-${idx}`}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-3xl bg-slate-200 h-80 group shadow-md"
              >
                <img
                  src={getImageUrl(cat.imagen)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  alt={cat.nombre}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#242A57]/90 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
                  <h3 className="text-2xl font-black text-white uppercase mb-3">{cat.nombre}</h3>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => setSelectedCategory(cat)}
                      className="w-full rounded-2xl bg-white text-[#242A57] py-2.5 text-xs font-black shadow-md hover:bg-orange-50 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye size={14} /> Vista Rápida Categoría
                    </button>
                    {!isTransportCategory(cat) && (
                      <Link
                        to={`/categoria/${cat.id}`}
                        className="text-orange-300 font-bold text-xs hover:underline text-center pt-1"
                      >
                        Ver selección premium →
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* MODAL DE CATEGORÍAS (CONDICIONAL: PRODUCTOS O TRANSPORTE/FLETES) */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div className="absolute inset-0" onClick={() => setSelectedCategory(null)} />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden z-10 border border-gray-100 max-h-[85vh] flex flex-col">
              <button onClick={() => setSelectedCategory(null)} className="absolute top-4 right-4 z-20 bg-gray-100 text-gray-700 p-2.5 rounded-full hover:bg-[#DE6E28] hover:text-white transition-colors">
                <X size={18} />
              </button>

              <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-xs flex-shrink-0 bg-gray-200">
                  <img src={getImageUrl(selectedCategory.imagen)} alt={selectedCategory.nombre} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-black text-[#DE6E28] uppercase tracking-widest">
                    {isTransportCategory(selectedCategory) ? "Servicio Logístico Especializado" : "Catálogo de Categoría"}
                  </span>
                  <h2 className="text-2xl font-black text-[#242A57] uppercase">{selectedCategory.nombre}</h2>
                </div>
              </div>

              <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
                {isTransportCategory(selectedCategory) ? (
                  // CONTENIDO ESPECIAL PARA FLETES / TRANSPORTE
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                      <h3 className="text-xl font-black text-[#242A57]">Logística y Transporte en Cadena de Frío</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Garantizamos un control estricto de temperatura de principio a fin para alimentos congelados y refrigerados, asegurando que tus productos conserven intactas sus propiedades en cada trayecto.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                        <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col items-center text-center">
                          <MapPin className="text-[#DE6E28] mb-2" size={24} />
                          <h4 className="font-bold text-[#242A57] text-xs">Regional / Local</h4>
                          <p className="text-[11px] text-gray-500 mt-1">Cali y Valle del Cauca</p>
                        </div>
                        <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col items-center text-center">
                          <Truck className="text-[#DE6E28] mb-2" size={24} />
                          <h4 className="font-bold text-[#242A57] text-xs">Nivel Nacional</h4>
                          <p className="text-[11px] text-gray-500 mt-1">Principales ciudades de Colombia</p>
                        </div>
                        <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 flex flex-col items-center text-center">
                          <Globe className="text-[#DE6E28] mb-2" size={24} />
                          <h4 className="font-bold text-[#242A57] text-xs">Internacional</h4>
                          <p className="text-[11px] text-gray-500 mt-1">Carga y exportación</p>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola Expomarket! Me interesa cotizar un servicio de transporte y fletes para alimentos congelados.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-sm hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                    >
                      <MessageSquare size={20} /> Cotizar Fletes por WhatsApp
                    </a>
                  </div>
                ) : (
                  // CONTENIDO NORMAL DE PRODUCTOS DE CATEGORÍA
                  <div>
                    {loadingCategoryProducts ? (
                      <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                        <div className="w-8 h-8 border-4 border-[#242A57] border-t-[#DE6E28] rounded-full animate-spin" />
                      </div>
                    ) : categoryProducts.length === 0 ? (
                      <div className="text-center py-12 text-gray-400 font-medium">No hay productos en esta categoría.</div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryProducts.map((producto, idx) => (
                          <div key={producto.id || idx} className="bg-white p-4 border border-gray-100 rounded-3xl flex flex-col justify-between shadow-xs">
                            <div>
                              <img src={getImageUrl(producto.imagen)} alt={producto.nombre} className="h-44 w-full object-cover rounded-2xl mb-3" />
                              <h4 className="font-bold text-[#242A57]">{producto.nombre}</h4>
                              <p className="text-[#DE6E28] font-black text-lg mt-1">${Number(producto.precio).toLocaleString("es-CO")}</p>
                            </div>
                            <div className="mt-4 space-y-2">
                              <button onClick={() => addToCart(producto)} className="w-full bg-[#242A57] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#DE6E28] transition-colors">
                                Añadir al carrito
                              </button>
                              <a
                                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola Expomarket! Me interesa información sobre Ventas Mayoristas para el producto: ${producto.nombre}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full block bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold text-center hover:bg-emerald-700 transition-colors"
                              >
                                💬 Ventas Mayoristas
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL DE PRODUCTO */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div className="absolute inset-0" onClick={() => setSelectedProduct(null)} />
            <motion.div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden z-10 flex flex-col lg:flex-row max-h-[90vh]">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-20 bg-gray-100 p-2.5 rounded-full hover:bg-[#DE6E28] hover:text-white transition-colors">
                <X size={18} />
              </button>
              <div className="w-full lg:w-1/2 h-64 lg:h-auto bg-gray-100">
                <img src={getImageUrl(selectedProduct.imagen)} alt={selectedProduct.nombre} className="w-full h-full object-cover" />
              </div>
              <div className="w-full lg:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black text-[#DE6E28] uppercase tracking-widest block mb-1">Detalle del Producto</span>
                  <h2 className="text-3xl font-black text-[#242A57]">{selectedProduct.nombre}</h2>
                  <p className="text-2xl font-black text-[#DE6E28] mt-2">${Number(selectedProduct.precio).toLocaleString("es-CO")}</p>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">{selectedProduct.descripcion || "Sin descripción detallada."}</p>

                  <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-2xl mt-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <CheckCircle className="w-4 h-4 text-[#DE6E28]" /> Venta por Libra y Kilo
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 mt-6">
                  <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} className="w-full bg-[#242A57] text-white py-3.5 font-bold rounded-2xl hover:bg-[#DE6E28] transition-colors text-xs shadow-sm">
                    Añadir al carrito
                  </button>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola Expomarket! Me interesa información sobre Ventas Mayoristas para el producto: ${selectedProduct.nombre}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block bg-emerald-600 text-white py-3.5 font-bold rounded-2xl text-center hover:bg-emerald-700 transition-colors text-xs shadow-sm"
                  >
                    💬 Hablar con Asesor Mayorista
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
