// src/pages/Checkout.jsx
import { motion } from "framer-motion";
import { useState } from "react";

export default function Checkout() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    codigoPostal: "",
    metodoPago: "tarjeta",
    numeroTarjeta: "",
    fechaExpiracion: "",
    cvv: "",
    notas: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Pedido confirmado. ¡Gracias por tu compra!");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto px-6 py-16"
    >
      <h2 className="text-4xl font-extrabold text-center mb-10 text-[#242a57]">
        Finalizar Compra
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 space-y-6 border-t-4 border-[#de6e28]"
      >
        {/* Datos personales */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0bafd4] transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Ejemplo: correo@dominio.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0bafd4] transition"
            />
          </div>
        </div>

        {/* Teléfono */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Teléfono de contacto
          </label>
          <input
            type="tel"
            name="telefono"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Ejemplo: +57 320 123 4567"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0bafd4] transition"
          />
        </div>

        {/* Dirección */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Dirección de envío
          </label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            placeholder="Calle 10 #20-15, Bogotá"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0bafd4] transition"
          />
        </div>

        {/* Ciudad / Departamento / Código postal */}
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0bafd4] transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Departamento
            </label>
            <input
              type="text"
              name="departamento"
              value={form.departamento}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0bafd4] transition"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Código postal
            </label>
            <input
              type="text"
              name="codigoPostal"
              value={form.codigoPostal}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0bafd4] transition"
            />
          </div>
        </div>

        {/* Método de pago */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Método de pago
          </label>
          <select
            name="metodoPago"
            value={form.metodoPago}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#de6e28] transition"
          >
            <option value="tarjeta">💳 Tarjeta de crédito</option>
            <option value="transferencia">🏦 Transferencia bancaria</option>
            <option value="efectivo">💵 Pago en efectivo</option>
          </select>
        </div>

        {/* Datos de tarjeta (condicional) */}
        {form.metodoPago === "tarjeta" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                name="numeroTarjeta"
                value={form.numeroTarjeta}
                onChange={handleChange}
                placeholder="**** **** **** ****"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0bafd4] transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Fecha expiración
              </label>
              <input
                type="month"
                name="fechaExpiracion"
                value={form.fechaExpiracion}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0bafd4] transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                CVV
              </label>
              <input
                type="password"
                name="cvv"
                value={form.cvv}
                onChange={handleChange}
                placeholder="***"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#0bafd4] transition"
              />
            </div>
          </motion.div>
        )}

        {/* Notas */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Notas adicionales
          </label>
          <textarea
            name="notas"
            value={form.notas}
            onChange={handleChange}
            placeholder="Ejemplo: Entregar entre 3 y 5 p.m., llamar antes de llegar..."
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-28 focus:ring-2 focus:ring-[#0bafd4] transition"
          ></textarea>
        </div>

        {/* Botón */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-gradient-to-r from-[#de6e28] to-[#0bafd4] text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
        >
          Confirmar pedido
        </motion.button>
      </form>
    </motion.div>
  );
}
