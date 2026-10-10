import { ChefHat, ExternalLink, Facebook, Instagram, Loader2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Importación del logo oficial de Expomarket
import logo from "../assets/logo.png";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setStatusMsg({ type: "", text: "" });

    try {
      const response = await fetch("http://localhost:8000/api/suscripciones/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setStatusMsg({ type: "success", text: data.success });
          setEmail("");
        } else {
          setStatusMsg({ type: "info", text: data.message });
        }
      } else {
        setStatusMsg({ type: "error", text: data.error || "Algo salió mal." });
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "No se pudo conectar con el servidor." });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-12 font-sans border-t-2 border-[#DE6E28]/30 relative overflow-hidden">
      {/* Luz ambiental sutil de fondo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#242A57]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* COLUMNA 1: Branding, Logo Alineado y Redes */}
          <div className="space-y-6">
            <Link to="/" className="inline-block bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shadow-xl backdrop-blur-md group transition-all hover:border-[#DE6E28]/50">
              <img
                src={logo}
                alt="Logo Expomarket"
                className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Llevamos la frescura inigualable del mar directamente a tu hogar o establecimiento gastronómico en Cali.
              Calidad institucional respaldada por <strong className="text-white font-bold">Grupo GRB SAS</strong>.
            </p>

            {/* Redes Sociales con estilo neón sutil */}
            <div className="flex gap-3 pt-2">
              <a
                href="#"
                aria-label="Facebook Expomarket"
                className="w-10 h-10 rounded-xl bg-slate-900/80 flex items-center justify-center border border-slate-800 text-slate-400 hover:border-[#DE6E28] hover:text-[#DE6E28] hover:bg-slate-800 transition-all shadow-md"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                aria-label="Instagram Expomarket"
                className="w-10 h-10 rounded-xl bg-slate-900/80 flex items-center justify-center border border-slate-800 text-slate-400 hover:border-[#DE6E28] hover:text-[#DE6E28] hover:bg-slate-800 transition-all shadow-md"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: Navegación Actualizada */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase text-xs tracking-widest border-b border-slate-800 pb-2.5 inline-block relative">
              Explorar
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#DE6E28]" />
            </h3>
            <ul className="space-y-3.5 text-sm font-semibold text-slate-400">
              <li>
                <Link to="/" className="hover:text-[#DE6E28] transition-colors flex items-center gap-2">
                  <span className="text-[#DE6E28] opacity-0 -ml-3 hover:opacity-100 transition-all">›</span> Inicio
                </Link>
              </li>
              <li>
                <Link to="/productos" className="hover:text-[#DE6E28] transition-colors flex items-center gap-2">
                  <span className="text-[#DE6E28] opacity-0 -ml-3 hover:opacity-100 transition-all">›</span> Productos del Mar
                </Link>
              </li>
              <li>
                <Link to="/recetas" className="hover:text-[#DE6E28] transition-colors flex items-center gap-2 text-white bg-[#DE6E28]/10 px-3 py-1.5 rounded-xl border border-[#DE6E28]/30 w-fit">
                  <ChefHat size={15} className="text-[#DE6E28]" /> Recetas del Mar
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: Atención y Ubicación */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase text-xs tracking-widest border-b border-slate-800 pb-2.5 inline-block relative">
              Atención Directa
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#DE6E28]" />
            </h3>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[#DE6E28] shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block uppercase">Línea WhatsApp</span>
                  <span className="text-white font-bold">+57 317 426 2521</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[#DE6E28] shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block uppercase">Correo Electrónico</span>
                  <span className="text-white font-medium break-all">contacto@expomarket.com</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[#DE6E28] shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-bold block uppercase">Cobertura</span>
                  <span className="text-white font-medium">Cali, Valle del Cauca y Alrededores</span>
                </div>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: Suscripción a Ofertas */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase text-xs tracking-widest border-b border-slate-800 pb-2.5 inline-block relative">
              Boletín Exclusivo
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-[#DE6E28]" />
            </h3>
            <p className="text-xs font-medium text-slate-400 mb-4 leading-relaxed">
              Recibe ofertas especiales, precios institucional mayorista y nuevas recetas cada semana.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu correo electrónico"
                  disabled={loading}
                  className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-medium text-white w-full focus:outline-none focus:border-[#DE6E28] transition-colors disabled:opacity-50 shadow-inner"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#DE6E28] hover:bg-[#c55d1f] text-white px-4 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center shrink-0 disabled:bg-slate-800"
                  title="Suscribirse"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <ExternalLink size={18} />}
                </button>
              </div>

              {/* Notificación dinámica */}
              {statusMsg.text && (
                <p className={`text-xs font-semibold p-2 rounded-xl border ${
                  statusMsg.type === "success" ? "bg-emerald-950/50 text-emerald-400 border-emerald-800" :
                  statusMsg.type === "info" ? "bg-amber-950/50 text-amber-400 border-amber-800" : "bg-rose-950/50 text-rose-400 border-rose-800"
                }`}>
                  {statusMsg.text}
                </p>
              )}
            </form>

            <div className="mt-6 flex items-center gap-2 text-[11px] text-slate-500 font-semibold bg-slate-900/40 p-2.5 rounded-xl border border-slate-900">
              <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
              <span>Cadena de frío y calidad garantizada</span>
            </div>
          </div>

        </div>

        {/* PIE DE PÁGINA: Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p className="text-slate-500 uppercase tracking-widest font-extrabold text-[10px]">
            © {new Date().getFullYear()} Expomarket | Grupo GRB SAS. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Términos de Servicio</a>
            <span>•</span>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidad</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
