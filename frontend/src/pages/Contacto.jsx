// src/pages/Contacto.jsx
import { motion } from "framer-motion";
import { useState } from "react";

export default function Contacto() {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Mensaje enviado. ¡Gracias por contactarnos!");
    setForm({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5f8ff] to-[#eaf5ff] flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-16">
      {/* Título principal */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#242a57] mb-3 sm:mb-4 text-center leading-snug"
      >
        Contáctanos
      </motion.h2>

      {/* Subtítulo */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 1 }}
        className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 text-center max-w-md sm:max-w-xl"
      >
        ¿Tienes alguna pregunta o sugerencia? En Expomarket nos encanta escucharte.
        Déjanos tu mensaje y te responderemos lo antes posible.
      </motion.p>

      {/* Tarjeta del formulario */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md md:max-w-lg border-t-8 border-[#de6e28]"
      >
        <div className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              placeholder="Tu nombre completo"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0bafd4] transition"
            />
          </div>

          {/* Correo */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="ejemplo@correo.com"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0bafd4] transition"
            />
          </div>

          {/* Mensaje */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1 text-sm sm:text-base">
              Mensaje
            </label>
            <textarea
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              required
              placeholder="Escribe tu mensaje..."
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 h-28 sm:h-36 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#0bafd4] transition resize-none"
            ></textarea>
          </div>
        </div>

        {/* Botón */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="mt-6 w-full bg-gradient-to-r from-[#de6e28] via-[#0bafd4] to-[#242a57] text-white py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg shadow-md hover:shadow-lg transition"
        >
          Enviar mensaje
        </motion.button>
      </motion.form>

      {/* Pie */}
      <p className="text-gray-500 text-xs sm:text-sm mt-8 text-center px-3">
        © {new Date().getFullYear()} Expomarket — Todos los derechos reservados.
      </p>
    </div>
  );
}
