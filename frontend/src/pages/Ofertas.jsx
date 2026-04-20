import axios from "axios";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Loader2, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

// Configuración de Axios
const api = axios.create({
  baseURL: "http://localhost:8000/api",
});

export default function Ofertas() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:8000";

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const res = await api.get("/productos/");
        // Filtramos solo productos que tienen un precio_oferta válido en tu BD
        const soloOfertas = res.data.filter(
          (p) => p.precio_oferta && Number(p.precio_oferta) < Number(p.precio)
        );
        setProductos(soloOfertas);
      } catch (err) {
        console.error("Error cargando productos de PostgreSQL:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOfertas();
  }, []);

  // Función clave: Transforma la ruta relativa de la BD en una URL completa
  const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/600x400?text=Expomarket+Cali";
    // Si la URL ya es completa la deja así, si no, le pega el dominio de Django
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white pt-24 selection:bg-orange-500/30">

      {/* --- HEADER DINÁMICO --- */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-12"
        >
          <div>
            <div className="flex items-center gap-2 text-orange-500 mb-4">
              <Flame size={24} fill="currentColor" />
              <span className="font-black uppercase tracking-tighter">Hot Deals Cali</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter">
              OFERTAS <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-400 to-amber-600">
                IMPERDIBLES
              </span>
            </h1>
          </div>
          <p className="max-w-xs text-slate-400 text-sm md:text-base leading-relaxed">
            Precios exclusivos de Expomarket para productos seleccionados de nuestra última pesca.
            Sujeto a disponibilidad diaria.
          </p>
        </motion.div>
      </section>

      {/* --- GRILLA DE OFERTAS REALES --- */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex flex-col items-center py-24">
            <Loader2 className="animate-spin text-orange-500" size={50} />
            <p className="mt-4 text-slate-500 animate-pulse">Consultando base de datos...</p>
          </div>
        ) : productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {productos.map((prod, idx) => (
              <motion.div
                key={prod.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                {/* Contenedor de Imagen de la BD */}
                <div className="relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-2xl">
                  <img
                    src={getImageUrl(prod.imagen)}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt={prod.nombre}
                  />

                  {/* Badge de Ahorro calculado al vuelo */}
                  <div className="absolute top-6 left-6 bg-white text-black font-black px-4 py-2 rounded-2xl text-sm shadow-xl z-10">
                    -{Math.round(((prod.precio - prod.precio_oferta) / prod.precio) * 100)}%
                  </div>

                  {/* Overlay al hacer hover */}
                  <div className="absolute inset-0 bg-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Info del Producto */}
                <div className="mt-8 px-2">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors uppercase">
                      {prod.nombre}
                    </h3>
                    <div className="flex flex-col items-end">
                      <span className="text-3xl font-black text-orange-500">
                        ${Number(prod.precio_oferta).toLocaleString('es-CO')}
                      </span>
                      <span className="text-sm text-slate-500 line-through">
                        ${Number(prod.precio).toLocaleString('es-CO')}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                    {prod.descripcion || "Calidad premium seleccionada para pescaderías y hogares en Cali."}
                  </p>

                  <button className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-black hover:bg-orange-500 hover:text-white transition-all transform active:scale-95">
                    <ShoppingCart size={20} />
                    AÑADIR AL PEDIDO
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed border-white/10 rounded-[3rem]">
            <p className="text-slate-500 text-xl">No hay productos en oferta registrados en el sistema.</p>
          </div>
        )}
      </section>

      {/* --- BANNER DE CIERRE MODERNO --- */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto bg-linear-to-r from-orange-600 to-amber-500 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-none">
              ¿MAYORISTA? <br /> <span className="text-slate-900">PRECIOS VIP</span>
            </h2>
            <button className="bg-slate-950 text-white px-10 py-5 rounded-full font-black flex items-center gap-4 hover:bg-white hover:text-black transition-all group">
              HABLAR CON ASESOR
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
          {/* Decoración abstracta */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
        </div>
      </section>

    </main>
  );
}
