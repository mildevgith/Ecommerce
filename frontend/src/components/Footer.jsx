import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1a237e] text-white py-10 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 🐟 Sección 1: Información general */}
        <div>
          <h2 className="text-xl font-bold mb-3 text-[#ff9800]">Expomarket</h2>
          <p className="text-gray-200 text-sm leading-relaxed">
            Tu tienda de confianza en pescados, mariscos y productos del mar frescos.
            Calidad garantizada y atención personalizada en cada pedido.
          </p>
        </div>

        {/* 📞 Sección 2: Contacto */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#ff9800]">Contáctanos</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Phone size={16} /> +57 300 123 4567
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} /> contacto@expomarket.com
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} /> Cartagena, Colombia
            </li>
          </ul>
        </div>

        {/* 🌐 Sección 3: Redes sociales */}
        <div>
          <h3 className="text-lg font-semibold mb-3 text-[#ff9800]">Síguenos</h3>
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff9800] transition"
            >
              <Facebook size={22} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#ff9800] transition"
            >
              <Instagram size={22} />
            </a>
          </div>
        </div>
      </div>

      {/* 🔻 Línea inferior */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-300">
        © {new Date().getFullYear()} Expomarket. Todos los derechos reservados.
      </div>
    </footer>
  );
}
