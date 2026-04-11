import { AnimatePresence, motion } from "framer-motion"; // libreria de animaciones para React.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// Importamos algunos iconos para las secciones nuevas (puedes usar lucide-react o emojis)
import { Clock, MessageSquare, ShieldCheck, Truck } from "lucide-react";

// img hero assets uso de manera local, ya que son imagenes fijas a lo contrario de las categorias o productos.
const HERO_IMAGES = [shirimhero, hero2, hero3];

import hero2 from "../assets/camaronprecoHero.jpg";
import hero3 from "../assets/Hero2.jpg";
import shirimhero from "../assets/shirimhero.jpg";
//-----------------------------------------------------------------------------------------------------------//


export default function Home() {
  const [index, setIndex] = useState(0);

  //hooks
  const [categories, setCategories] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);

  // carrusel automatico
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // funciones asincronas para consumir los datos de la Api Rest
  useEffect(() => {
    const fetchData = async () => {
      try {

        const resCat = await fetch("http://localhost:8000/api/categorias/");
        const dataCat = await resCat.json();
        setCategories(dataCat);

        const resProd = await fetch("http://localhost:8000/api/productos/");
        const dataProd = await resProd.json();
        // Filtramos por los que marcaste como destacados o los primeros 4
        const destacados = dataProd.filter(p => p.es_destacado === true);
        setProductosDestacados(destacados.length > 0 ? destacados.slice(0, 4) : dataProd.slice(0, 4));

      } catch (error) {
        console.error("Error conectando con la API de Expomarket:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-orange-200">
      {/* hero */}
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
              alt="Expomarket Hero"
            />
            <div className="absolute inset-0 bg-gradient-to from-slate-900 via-slate-900/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl">
            Frescura que se <br />
            <span className="bg-gradient-to from-orange-400 to-amber-600 bg-clip-text text-transparent">
              siente en cada bocado
            </span>
          </motion.h1>
          <div className="mt-10 flex gap-4">
            <Link to="/productos" className="rounded-full bg-orange-500 px-8 py-4 font-bold text-white hover:bg-orange-600">
              Explorar Tienda
            </Link>
          </div>
        </div>
      </section>

      {/* hero fin */}

      {/* NUEVA SECCIÓN 1: POR QUÉ ELEGIRNOS (STATS) */}
      <section className="bg-white py-12 border-b">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600"><Truck size={30}/></div>
            <h3 className="font-bold text-slate-900">Envíos en Cali</h3>
            <p className="text-sm text-slate-500">Llegamos a todo el sur de la ciudad.</p>
          </div>
          <div className="flex flex-col items-center border-x border-slate-100">
            <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600"><ShieldCheck size={30}/></div>
            <h3 className="font-bold text-slate-900">Calidad Premium</h3>
            <p className="text-sm text-slate-500">Productos seleccionados rigurosamente.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600"><Clock size={30}/></div>
            <h3 className="font-bold text-slate-900">Cadena de Frío</h3>
            <p className="text-sm text-slate-500">Garantizamos la temperatura ideal.</p>
          </div>
        </div>
      </section>

      {/* categorias .map (TU CÓDIGO ORIGINAL) */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-orange-500">Categorías</h2>
            <p className="mt-2 text-4xl font-extrabold text-slate-900">¿Qué se te antoja hoy?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -8 }}
              className="relative overflow-hidden rounded-3xl bg-slate-200 shadow-sm h-80 group"
            >
              <img src={cat.imagen} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to from-black/80 via-black/20 p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white">{cat.nombre}</h3>
                <Link to={`/categoria/${cat.nombre.toLowerCase()}`} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver selección premium →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* productos (TU CÓDIGO ORIGINAL) */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-3xl font-bold mb-10 text-slate-900">Nuestros Recomendados</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {productosDestacados.map((producto) => (
            <div key={producto.id} className="group relative rounded-2xl bg-white p-3 border shadow-sm transition-all hover:shadow-md">
              <div className="relative overflow-hidden rounded-xl h-64">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="h-full w-full object-cover transition-transform group-hover:scale-110"
                />
              </div>
              <div className="mt-4 p-2 text-center">
                <h3 className="text-lg font-bold text-slate-800">{producto.nombre}</h3>
                <p className="mt-1 text-orange-500 font-bold text-xl">
                  ${producto.precio.toLocaleString()} <span className="text-xs text-slate-400">/ Kg</span>
                </p>
                <button className="mt-4 w-full rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-orange-500 transition-colors">
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NUEVA SECCIÓN 2: BANNER PARA MAYORISTAS */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          <div className="flex-1 z-10">
            <span className="text-orange-500 font-bold uppercase text-sm">B2B Expomarket</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6">¿Surtimos tu negocio?</h2>
            <p className="text-slate-400 mb-8 max-w-md">Ofrecemos precios especiales para restaurantes, hoteles y pescaderías en Cali. Calidad y cumplimiento constante.</p>
            <button className="flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all">
              <MessageSquare size={20}/> Hablar con un asesor
            </button>
          </div>
          <div className="flex-1 relative">
             <div className="w-64 h-64 bg-orange-500/20 rounded-full blur-3xl absolute -top-10 -right-10"></div>
             <img src={shirimhero} className="rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" alt="Suministro" />
          </div>
        </div>
      </section>

    </main>
  );
}
