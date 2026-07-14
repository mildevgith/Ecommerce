import { useState } from "react"; // Importo hook para gestionar estados locales
import { Facebook, Instagram, Mail, Phone, MapPin, ExternalLink, Loader2 } from "lucide-react"; // Importo iconos desde lucide-react
import { Link } from "react-router-dom"; // Importo componente de navegación

// Importación de imágenes locales para el branding
import logo from "../assets/logo.png"; // Importo archivo de imagen del logo
import slogan from "../assets/slogan.png"; // Importo archivo de imagen del eslogan

export default function Footer() {
  const [email, setEmail] = useState(""); // Estado para guardar el valor del input de suscripción
  const [loading, setLoading] = useState(false); // Estado para manejar el estado de carga
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" }); // Estado para mensajes de feedback al usuario

  // Función asíncrona para manejar el envío del formulario
  const handleSubscribe = async (e) => {
    e.preventDefault(); // Evito que la página se recargue al enviar
    if (!email) return; // Si no hay email, no hago nada

    setLoading(true); // Activo estado de carga
    setStatusMsg({ type: "", text: "" }); // Limpio mensajes previos

    try {
      // Realizo petición POST al backend local
      const response = await fetch("http://localhost:8000/api/suscripciones/", {
        method: "POST", // Método HTTP
        headers: {
          "Content-Type": "application/json", // Especifico formato JSON
        },
        body: JSON.stringify({ email }), // Envío el email como cuerpo de la petición
      });

      const data = await response.json(); // Convierto respuesta a JSON

      if (response.ok) { // Si la respuesta es exitosa (200-299)
        if (data.success) {
          setStatusMsg({ type: "success", text: data.success }); // Mensaje de éxito
          setEmail(""); // Limpio el input
        } else {
          setStatusMsg({ type: "info", text: data.message }); // Mensaje informativo (ej: ya registrado)
        }
      } else {
        setStatusMsg({ type: "error", text: data.error || "Algo salió mal." }); // Manejo de error del servidor
      }
    } catch (error) {
      setStatusMsg({ type: "error", text: "No se pudo conectar con el servidor." }); // Error de red
    } finally {
      setLoading(false); // Desactivo estado de carga
      setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000); // Limpio mensaje tras 4 segundos
    }
  };

  return (
    // Contenedor principal con fondo oscuro, padding y fuente sin serifa
    <footer className="bg-slate-950 text-white pt-20 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* GRID PRINCIPAL: 1 columna en móvil, 2 en tablet, 4 en PC */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* COLUMNA 1: Branding y Redes Sociales */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src={logo} alt="Logo Expomarket" className="h-16 w-auto object-contain transition-transform hover:scale-105" />
            </Link>

            <Link to="/" className="inline-block">
              <img src={slogan} alt="Slogan" className="h-12 w-auto object-contain transition-transform hover:scale-105" />
            </Link>

            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Llevamos la frescura del mar directamente a tu hogar o negocio en Cali. 
              Calidad premium garantizada por **Grupo GRB SAS**.
            </p>

            {/* Iconos con efectos Hover en naranja */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 hover:border-orange-500 hover:text-orange-500 transition-all shadow-lg">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center border border-slate-800 hover:border-orange-500 hover:text-orange-500 transition-all shadow-lg">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* COLUMNA 2: Navegación rápida */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase text-xs tracking-widest border-b border-slate-800 pb-2 inline-block">Navegación</h3>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link to="/" className="hover:text-orange-500 transition-colors">Inicio</Link></li>
              <li><Link to="/productos" className="hover:text-orange-500 transition-colors">Productos</Link></li>
              <li><Link to="/nosotros" className="hover:text-orange-500 transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/ofertas" className="hover:text-orange-500 transition-colors">Ofertas</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: Contacto */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase text-xs tracking-widest border-b border-slate-800 pb-2 inline-block">Atención</h3>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-orange-500 shrink-0" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-orange-500 shrink-0" />
                <span className="break-all">contacto@expomarket.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-orange-500 shrink-0" />
                <span>Cali, Valle del Cauca<br/>Sector Sur</span>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: Suscripción */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase text-xs tracking-widest border-b border-slate-800 pb-2 inline-block">Suscripción</h3>
            <p className="text-sm font-medium text-slate-400 mb-4">Entérate de nuestras ofertas premium.</p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Tu email"
                  disabled={loading}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-medium w-full focus:outline-none focus:border-orange-500 transition-colors disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-orange-500 hover:bg-orange-600 px-3 rounded-xl transition-colors shadow-lg shadow-orange-500/20 flex items-center justify-center disabled:bg-slate-800"
                >
                  {/* Muestra spinner de carga o icono de envío */}
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <ExternalLink size={18} />}
                </button>
              </div>
              
              {/* Notificación dinámica */}
              {statusMsg.text && (
                <p className={`text-xs font-semibold mt-2 transition-all ${
                  statusMsg.type === "success" ? "text-emerald-400" :
                  statusMsg.type === "info" ? "text-amber-400" : "text-rose-400"
                }`}>
                  {statusMsg.text}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* PIE DE PÁGINA: Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} Expomarket | Grupo GRB SAS
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-widest font-bold text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          </div>
        </div>
      </div>
    </footer>
  );
}