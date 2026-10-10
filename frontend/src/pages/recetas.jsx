import { motion } from "framer-motion";
import { Clock, Users, ShoppingCart, MessageSquare, Sparkles, ArrowRight, ChefHat, Play, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import api from "../axios";

export default function Recetas() {
  const whatsappNumber = "573174262521";
  const [recetasList, setRecetasList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Reemplaza esta URL con el enlace público real de tu video en Supabase Storage
  const brandVideoUrl = "https://dwmycqqysdursrzpxgzz.supabase.co/storage/v1/object/public/Products/video%20de%20ceviches.mp4";

  useEffect(() => {
    const fetchRecetas = async () => {
      try {
        const response = await api.get('/recetas/');
        const data = response.data;
        setRecetasList(Array.isArray(data) ? data : (data.results || []));
      } catch (error) {
        console.error("Error cargando recetas desde el backend:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecetas();
  }, []);

  const toggleAudio = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-24 selection:bg-orange-200">

      {/* HERO MODAL Y ELEGANTE */}
      <section className="bg-gradient-to-br from-[#242A57] via-[#1a1f3c] to-[#242A57] text-white py-16 lg:py-24 px-6 relative overflow-hidden border-b-4 border-[#DE6E28]">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#DE6E28_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Columna de Texto Institucional */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#DE6E28]/20 border border-[#DE6E28]/40 text-orange-300 text-xs font-black uppercase tracking-widest shadow-inner">
              <ChefHat className="w-4 h-4 text-[#DE6E28]" /> Inspiración Culinaria Expomarket
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Recetas del Mar para <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Sorprender</span>
            </h1>
            <p className="text-slate-300 text-base lg:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Eleva tus preparaciones en casa con la frescura inigualable de nuestros pescados y mariscos seleccionados en Cali. Explora el paso a paso en video y cocina como todo un chef profesional.
            </p>
            <div className="pt-2 flex flex-wrap justify-center lg:justify-start gap-4 text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">✨ Calidad Institucional</span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">🐟 Producto Fresco</span>
              <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">🚀 Envíos Seguros</span>
            </div>
          </div>

          {/* Columna del Video Corporativo (Proporción vertical respetada con object-contain) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-[#DE6E28] to-amber-500 rounded-3xl blur opacity-30 animate-pulse" />

              <div className="relative bg-[#242A57] rounded-3xl overflow-hidden shadow-2xl border border-white/10 aspect-[4/5] flex items-center justify-center group">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-contain bg-[#242A57]"
                >
                  <source src={brandVideoUrl} type="video/mp4" />
                  Tu navegador no soporta videos HTML5.
                </video>

                {/* Botón flotante para activar/desactivar audio */}
                <button
                  onClick={toggleAudio}
                  className="absolute bottom-4 right-4 bg-black/70 hover:bg-black text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all shadow-lg flex items-center gap-2 text-xs font-bold"
                  title={isMuted ? "Activar audio" : "Silenciar"}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} className="text-orange-400" />}
                </button>

                <div className="absolute top-4 left-4 pointer-events-none">
                  <span className="text-white text-[10px] font-black uppercase tracking-wider bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
                    🎬 Experiencia Expomarket
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* GRILLA DE RECETAS */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#DE6E28] block mb-1">Paso a Paso en Video</span>
            <h2 className="text-3xl font-black text-[#242A57]">Nuestras Recomendaciones de Cocina</h2>
          </div>
          <p className="text-sm text-gray-500 font-medium">Haz clic en "Ver Video" para aprender la preparación exacta en YouTube.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-[#242A57] border-t-[#DE6E28] rounded-full animate-spin shadow-md" />
          </div>
        ) : recetasList.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-semibold bg-white rounded-3xl border border-gray-100 shadow-sm max-w-md mx-auto">
            Pronto agregaremos nuevas recetas desde el panel de administración.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recetasList.map((receta) => (
              <motion.div
                key={receta.id}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-lg shadow-slate-200/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-72 overflow-hidden bg-slate-100">
                    <img
                      src={receta.imagen || "https://via.placeholder.com/800x600?text=Expomarket"}
                      alt={receta.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity flex items-center justify-center">
                      {receta.youtube_url ? (
                        <a
                          href={receta.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#DE6E28] hover:bg-[#c55d1f] text-white px-6 py-3.5 rounded-2xl shadow-xl transform group-hover:scale-105 transition-all flex items-center gap-2.5 text-xs font-black uppercase tracking-wider border border-orange-400/30"
                          title="Ver preparación en YouTube"
                        >
                          <Play size={18} fill="white" /> Ver Preparación en Video
                        </a>
                      ) : (
                        <span className="bg-white/90 backdrop-blur-md text-[#242A57] text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                          {receta.categoria}
                        </span>
                      )}
                    </div>
                    {receta.youtube_url && (
                      <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[#242A57] text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                        {receta.categoria}
                      </span>
                    )}
                  </div>

                  <div className="p-8 pb-4">
                    <div className="flex items-center gap-4 text-xs font-extrabold text-gray-400 mb-3">
                      <span className="flex items-center gap-1 text-[#DE6E28]">
                        <Clock size={15} /> {receta.tiempo}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users size={15} /> {receta.porciones}
                      </span>
                      <span>•</span>
                      <span>Dificultad: {receta.dificultad}</span>
                    </div>

                    <h3 className="text-2xl font-black text-[#242A57] mb-3 group-hover:text-[#DE6E28] transition-colors">{receta.titulo}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{receta.descripcion}</p>

                    <div className="bg-orange-50/70 border border-orange-100/80 p-4 rounded-2xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Ingrediente principal: <strong className="text-[#DE6E28]">{receta.ingrediente_principal}</strong>
                      </span>
                      <Sparkles size={18} className="text-[#DE6E28]" />
                    </div>
                  </div>
                </div>

                <div className="p-8 pt-4 flex flex-col sm:flex-row gap-3.5">
                  <Link
                    to="/productos"
                    className="flex-1 bg-[#242A57] text-white py-4 rounded-2xl text-xs font-black hover:bg-[#DE6E28] transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 text-center"
                  >
                    <ShoppingCart size={16} /> Comprar Ingredientes <ArrowRight size={14} />
                  </Link>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola Expomarket! Me antojé de la receta "${receta.titulo}" y quisiera pedir sus ingredientes.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 text-white px-6 py-4 rounded-2xl text-xs font-black hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={16} /> Consultar
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* BANNER INFERIOR DE MAYORISTAS */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="bg-gradient-to-r from-[#242A57] via-slate-900 to-[#242A57] rounded-3xl p-8 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#DE6E28_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="space-y-3 text-center md:text-left relative z-10 max-w-xl">
            <span className="text-xs font-black uppercase tracking-widest text-[#DE6E28] bg-[#DE6E28]/10 px-3 py-1 rounded-full border border-[#DE6E28]/30">
              Aliados Gastronómicos
            </span>
            <h3 className="text-2xl md:text-4xl font-black">¿Tienes un restaurante o negocio en Cali?</h3>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Abastecemos a los mejores establecimientos con producto fresco, estandarizado y con cadena de frío garantizada.
            </p>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola Expomarket! Me interesa conocer más sobre el abastecimiento mayorista para mi negocio gastronómico.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#DE6E28] text-white px-8 py-4 rounded-2xl font-black text-xs md:text-sm hover:bg-[#c55d1f] hover:scale-105 transition-all shadow-xl shadow-orange-500/30 flex items-center gap-2.5 shrink-0 relative z-10"
          >
            <MessageSquare size={18} /> Hablar con Asesor Mayorista
          </a>
        </div>
      </section>

    </main>
  );
}
