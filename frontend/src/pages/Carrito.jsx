import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CreditCard, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// Assets
import anillosHome from "../assets/anillosHome.jpeg";
import fileteTilapia from "../assets/fileteTilapia.jpeg";
import CartItem from "../components/CartItem";

export default function Carrito() {
  // Nota: Los precios en JS no deben llevar punto para miles si vas a operar con ellos
  const [carrito, setCarrito] = useState([
    {
      id: 1,
      nombre: "Anillos de calamar",
      precio: 35000,
      cantidad: 2,
      imagen: anillosHome,
    },
    {
      id: 2,
      nombre: "Filete de Tilapia",
      precio: 22000,
      cantidad: 1,
      imagen: fileteTilapia,
    },
  ]);

  const handleAdd = (id) => {
    setCarrito((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item,
      ),
    );
  };

  const handleRemove = (id) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        {/* Encabezado con Icono */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-12"
        >
          <div className="bg-orange-500/10 p-3 rounded-full mb-4">
            <ShoppingBag className="text-orange-600 w-8 h-8" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 text-center">
            Tu Carrito de Compras
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Revisa tus productos antes de finalizar el pedido.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {carrito.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center bg-white border border-slate-100 py-16 px-8 rounded-[2rem] shadow-sm"
            >
              <p className="text-xl text-slate-600 mb-8 font-medium">
                Tu carrito está vacío. ¡Explora los mejores mariscos!
              </p>
              <Link
                to="/productos"
                className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-orange-500 transition-all duration-300"
              >
                <ArrowLeft size={20} />
                Ver Productos
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Card principal de productos */}
              <div className="bg-white shadow-xl shadow-slate-200/50 rounded-[2rem] p-4 sm:p-8 border border-slate-50">
                <div className="divide-y divide-slate-100">
                  {carrito.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onAdd={handleAdd}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>

                {/* Resumen de Pago */}
                <div className="mt-10 pt-8 border-t-2 border-dashed border-slate-100">
                  <div className="flex justify-between items-center mb-8">
                    <span className="text-slate-500 font-bold text-lg">
                      Resumen Total
                    </span>
                    <p className="text-3xl font-black text-slate-900">
                      <span className="text-orange-500 text-xl mr-1">$</span>
                      {total.toLocaleString("es-CO")}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Link
                      to="/productos"
                      className="flex items-center justify-center gap-2 bg-slate-100 text-slate-600 font-bold px-8 py-4 rounded-xl hover:bg-slate-200 transition-all order-2 sm:order-1"
                    >
                      Seguir Comprando
                    </Link>

                    <Link
                      to="/checkout"
                      className="flex items-center justify-center gap-2 bg-orange-500 text-white font-black px-8 py-4 rounded-xl shadow-lg shadow-orange-200 hover:bg-slate-900 hover:shadow-none transition-all order-1 sm:order-2"
                    >
                      <CreditCard size={20} />
                      Proceder al Pago
                    </Link>
                  </div>
                </div>
              </div>

              {/* Nota de seguridad / Confianza */}
              <p className="text-center text-slate-400 text-sm font-medium">
                🔒 Compra segura procesada por el sello de calidad Grupo GRB
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
