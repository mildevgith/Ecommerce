import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import anillosHome from "../assets/imgsHero/anillosHome.jpeg";
import fileteTilapia from "../assets/imgsHero/fileteTilapia.jpeg";
import CartItem from "../components/CartItem";

export default function Carrito() {
  const [carrito, setCarrito] = useState([
    {
      id: 1,
      nombre: "Anillos de calamar",
      precio: 35.000,
      cantidad: 2,
      imagen: anillosHome,
    },
    {
      id: 2,
      nombre: "Filete de Tilapia",
      precio: 22.000,
      cantidad: 1,
      imagen: fileteTilapia,
    },
  ]);

  const handleAdd = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
      )
    );
  };

  const handleRemove = (id) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id && item.cantidad > 1
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  return (
    <div className="pt-24 px-6 min-h-screen bg-gray-50">
      {/* 🛒 Encabezado */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl font-extrabold text-center text-[#242a57] mb-10"
      >
        Tu Carrito de Compras
      </motion.h2>

      {carrito.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 py-20"
        >
          <p className="text-lg mb-6">
            Tu carrito está vacío. ¡Explora nuestros productos!
          </p>
          <Link
            to="/productos"
            className="inline-block bg-[#0bafd4] text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#242a57] transition-all"
          >
            Ver Productos
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-6"
        >
          {/* 🧾 Lista de productos */}
          <div className="divide-y divide-gray-200">
            {carrito.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* 💰 Total y acciones */}
          <div className="text-right mt-8">
            <p className="text-2xl font-bold text-[#242a57] mb-4">
              Total:{" "}
              <span className="text-[#de6e28]">
                ${total.toLocaleString()}
              </span>
            </p>

            <div className="flex justify-end gap-4">
              <Link
                to="/productos"
                className="bg-gray-200 text-[#242a57] font-semibold px-6 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Seguir comprando
              </Link>

              <Link
                to="/checkout"
                className="bg-[#de6e28] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#0bafd4] transition"
              >
                Proceder al pago
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
