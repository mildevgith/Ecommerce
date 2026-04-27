import { Facebook, Instagram, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

// Importación de imágenes locales para el branding
import logo from "../assets/logo.png";
import slogan from "../assets/slogan.png";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        {/* GRID PRINCIPAL: 1 col en móvil, 2 en tablet, 4 en PC */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* COLUMNA 1: Branding y Redes Sociales */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img
                src={logo}
                alt="Logo Expomarket"
                className="h-16 w-auto object-contain transition-transform hover:scale-105"
              />
            </Link>

            <Link to="/" className="inline-block">
              <img
                src={slogan}
                alt="Slogan"
                className="h-12 w-auto object-contain transition-transform hover:scale-105"
              />
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

          {/* COLUMNA 2: Navegación rápida con React Router */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase text-xs tracking-widest border-b border-slate-800 pb-2 inline-block">Navegación</h3>
            <ul className="space-y-4 text-sm font-medium text-slate-400">
              <li><Link to="/" className="hover:text-orange-500 transition-colors">Inicio</Link></li>
              <li><Link to="/productos" className="hover:text-orange-500 transition-colors">Productos</Link></li>
              <li><Link to="/nosotros" className="hover:text-orange-500 transition-colors">Sobre Nosotros</Link></li>
              {/* IMPORTANTE: Asegúrate de tener esta ruta configurada en App.js */}
              <li><Link to="/ofertas" className="hover:text-orange-500 transition-colors">Ofertas</Link></li>
            </ul>
          </div>

          {/* COLUMNA 3: Información de contacto (Cali) */}
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

          {/* COLUMNA 4: Newsletter / Suscripción */}
          <div>
            <h3 className="text-white font-black mb-6 uppercase text-xs tracking-widest border-b border-slate-800 pb-2 inline-block">Suscripción</h3>
            <p className="text-sm font-medium text-slate-400 mb-4">Entérate de nuestras ofertas premium.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Tu email"
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-sm font-medium w-full focus:outline-none focus:border-orange-500 transition-colors"
              />
              <button className="bg-orange-500 hover:bg-orange-600 px-3 rounded-xl transition-colors shadow-lg shadow-orange-500/20">
                <ExternalLink size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* PIE DE PÁGINA: Copyright con año dinámico */}
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
