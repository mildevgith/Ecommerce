import { AnimatePresence, motion } from "framer-motion"; // libreria de animaciones para React.
import { useEffect, useState } from "react"; // hooks para uso de efecto y uso de estado.
import { Link } from "react-router-dom"; //enrrutamiento dinamico



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
        setProductosDestacados(dataProd.slice(0, 5));

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

      {/* categorias .map */}
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

      {/* productos*/}
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
    </main>
  );
}
