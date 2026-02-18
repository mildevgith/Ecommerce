import { AnimatePresence, motion } from "framer-motion";

import { ArrowRight } from "lucide-react";

import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

/// importaciones de las imagenes a usar en el hero
import hero2 from "../assets/imgsHero/Hero1.jpg";
import hero3 from "../assets/imgsHero/Hero2.jpg";
import shirimhero from "../assets/imgsHero/shirimhero.jpg";

// imgs categorías
import complementosImg from "../assets/imgsHero/Complementos.jpg";
import crustaceosImg from "../assets/imgsHero/Crustaceos.jpeg";
import filetesImg from "../assets/imgsHero/filetes.jpeg";
import fishcateImg from "../assets/imgsHero/fishcate.jpeg";

// uso de variables de imgs
const HERO_IMAGES = [shirimhero, hero2, hero3];

const CATEGORIES = [
  {
    id: 1,
    label: "Pescados Enteros",
    img: fishcateImg,
    size: "md:col-span-2"
  },
  {
    id: 2,
    label: "Mariscos",
    img: crustaceosImg,
    size: "md:col-span-1"
  },
  {
    id: 3,
    label: "Complementos",
    img: complementosImg,
    size: "md:col-span-1"
  },
  {
    id: 4,
    label: "Filetes",
    img: filetesImg,
    size: "md:col-span-2"
  },
];

import enteros from "../assets/imgsHero/enteros.jpeg";
import fileteTilapia from "../assets/imgsHero/fileteTilapia.jpeg";
import langostinoHome from "../assets/imgsHero/langostinoHome.jpeg";
import Salmon from "../assets/imgsHero/salmon.jpg";

const PROD_DESTACADOS = [
  { nombre: "Tilapia Fresca", precio: "$25.000", img: fileteTilapia },
  { nombre: "Salmón Premium", precio: "$48.000", img: Salmon },
  { nombre: "Bagre basa", precio: "$18.000", img: enteros },
  { nombre: "Langostino sin cabeza y con cascara", precio: "$35.000", img: langostinoHome },
];




export default function Home() {
  const [index, setIndex] = useState(0);

  // Cambio automático optimizado
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/50 selection:bg-orange-200">

      {/* ===== HERO SECTION CON ANIMATE PRESENCE =====
          POR QUÉ: AnimatePresence permite que la imagen anterior salga suavemente
          mientras la nueva entra, creando un efecto cinematográfico.
      */}
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
            {/* Overlay Gradiente Dinámico */}
            <div className="absolute inset-0 bg-gradient-to from-slate-900 via-slate-900/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-full bg-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 backdrop-blur-md"
          >
             Lo mejor del mar a tu mesa
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            Frescura que se <br />
            <span className="bg-gradient-to from-orange-400 to-amber-600 bg-clip-text text-transparent">
              siente en cada bocado
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <Link to="/productos" className="group flex items-center gap-2 rounded-full bg-orange-500 px-8 py-4 font-bold text-white transition-all hover:bg-orange-600 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]">
              Explorar Tienda
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <button className="rounded-full border border-white/30 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20">
              Ofertas VIP
            </button>
          </motion.div>
        </div>

        {/* Indicadores de Slide Modernos (Dashes) */}
        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-3 z-20">
          {HERO_IMAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${index === i ? "w-10 bg-orange-500" : "w-4 bg-white/30"}`}
            />
          ))}
        </div>
      </section>

      {/* ===== BENTO GRID CATEGORIES =====
          POR QUÉ: El grid tradicional es aburrido. El Bento Grid (usado por Apple)
          da jerarquía visual: unas cosas se ven más importantes que otras.
      */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-orange-500">Categorías</h2>
            <p className="mt-2 text-4xl font-extrabold text-slate-900 md:text-5xl">¿Qué se te antoja hoy?</p>
          </div>
          <Link to="/categorias" className="text-sm font-bold text-slate-400 hover:text-orange-500">Ver todo →</Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -8 }}
              className={`relative overflow-hidden rounded-3xl bg-slate-200 shadow-sm ${cat.size} h-80 group`}
            >
              <img src={cat.img} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white">{cat.label}</h3>
                <p className="text-slate-300 opacity-0 transition-opacity group-hover:opacity-100">Ver selección premium</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== PRODUCTOS DESTACADOS CON GLASSMORPHISM EN BOTONES ===== */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {/* Ahora mapeamos el array REAL que creaste arriba */}
        {PROD_DESTACADOS.map((producto, i) => (
          <div key={i} className="group relative rounded-2xl bg-white/5 p-3 border border-white/10 transition-all hover:bg-white/10">
            <div className="relative overflow-hidden rounded-xl h-64">
              {/* ✅ AQUÍ ESTÁ EL TRUCO: Usamos la variable de la imagen */}
              <img
                src={producto.img}
                alt={producto.nombre}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase">Nuevo</div>
            </div>
            <div className="mt-4 p-2 text-center">
              <h3 className="text-lg font-bold">{producto.nombre}</h3>
              <p className="mt-1 text-orange-400 font-mono text-xl">
                {producto.precio} <span className="text-xs text-white/50">/ Kg</span>
              </p>
              <button className="mt-4 w-full rounded-xl bg-white py-3 font-bold text-slate-900 transition-transform active:scale-95 hover:bg-orange-500 hover:text-white">
                Añadir al carrito
              </button>
            </div>
          </div>
        ))}
     </div>

      {/* ===== NEWSLETTER MINIMALISTA ===== */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="rounded-[3rem] bg-orange-500 p-12 text-center text-white shadow-2xl shadow-orange-500/20 relative overflow-hidden">
             {/* Círculos decorativos */}
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-orange-400/30" />

            <div className="relative z-10">
              <h2 className="text-4xl font-black">No te pierdas de nada</h2>
              <p className="mt-4 text-orange-100">Suscríbete para recibir recetas exclusivas y descuentos relámpago.</p>

              <form className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
                <input
                  type="email"
                  placeholder="Tu mejor email"
                  className="rounded-full bg-white/20 px-8 py-4 text-white placeholder:text-orange-100 border border-white/30 focus:outline-none focus:bg-white/30 md:w-96"
                />
                <button className="rounded-full bg-white px-8 py-4 font-bold text-orange-500 shadow-lg hover:shadow-xl transition-all">
                  Suscribirme ahora
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
