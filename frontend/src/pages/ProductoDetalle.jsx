// src/pages/ProductoDetalle.jsx
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

// Imágenes de ejemplo
import Hero from "../assets/imgsHero/hero3.jpeg";
import salmon from "../assets/imgsHero/salmon.jpg";
// import recetaVideo from "../assets/videos/receta.mp4"; // ← si usas un video local

export default function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const mockProductos = [
      {
        id: 1,
        nombre: "Filete de Salmón Premium",
        descripcion:
          "Corte fresco de salmón del Pacífico, ideal para parrilla o sushi. Rico en omega 3, con textura suave y sabor inigualable.",
        precio: 32000,
        stock: 15,
        rating: 4.8,
        categoria: "Pescados",
        imagenes: [salmon, Hero],
        video: "https://www.youtube.com/embed/x4PAphlfa0M?si=aL9JV_0f3m9HqzAw",
      },
      {
        id: 2,
        nombre: "Posta de Bagre Fresco",
        descripcion:
          "Filete jugoso y tierno, perfecto para asar, freír o preparar en salsa criolla. Pescado fresco de cultivo sostenible.",
        precio: 28000,
        stock: 8,
        rating: 4.6,
        categoria: "Pescados",
        imagenes: [Hero, salmon],
        video: "https://www.youtube.com/embed/MG1PPluUqgQ",
      },

    ];

    const encontrado = mockProductos.find(
      (item) => item.id === parseInt(id)
    );
    setProducto(encontrado);
  }, [id]);

  if (!producto) {
    return (
      <div className="text-center py-20 text-gray-500">
        Cargando producto...
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pt-28 max-w-7xl mx-auto px-6 py-12"
      >
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Imagen principal */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
          >
            <img
              src={producto.imagenes[0]}
              alt={producto.nombre}
              className="w-full h-[450px] object-cover"
            />
          </motion.div>

          {/* Información del producto */}
          <div>
            <h2 className="text-sm uppercase tracking-wider text-[#0bafd4] mb-2">
              {producto.categoria}
            </h2>

            <h1 className="text-4xl font-bold text-[#242a57] mb-4">
              {producto.nombre}
            </h1>

            {/* Calificación con estrellas */}
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  className={`${
                    i < Math.round(producto.rating)
                      ? "text-[#de6e28]"
                      : "text-gray-300"
                  }`}
                  fill={i < Math.round(producto.rating) ? "#de6e28" : "none"}
                />
              ))}
              <span className="ml-2 text-gray-600">
                {producto.rating.toFixed(1)} / 5.0
              </span>
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              {producto.descripcion}
            </p>

            <p className="text-3xl font-semibold text-[#de6e28] mb-4">
              ${producto.precio.toLocaleString()}
            </p>

            <p
              className={`mb-6 font-semibold ${
                producto.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {producto.stock > 0
                ? `Disponibles: ${producto.stock} unidades`
                : "Sin stock"}
            </p>

            {/* Botones de acción */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#de6e28] to-[#0bafd4] text-white font-semibold py-3 px-8 rounded-xl shadow-md transition"
              >
                🛒 Agregar al carrito
              </motion.button>

              <Link
                to="/productos"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-xl shadow-sm transition"
              >
                Ver más productos
              </Link>
            </div>
          </div>
        </div>

        {/* Galería secundaria + Video */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-[#242a57] mb-6">
            Galería y receta recomendada
          </h3>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Galería de imágenes */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              {producto.imagenes.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Vista ${index + 1}`}
                  className="w-56 h-40 object-cover rounded-xl shadow-md hover:scale-105 transition-transform"
                />
              ))}
            </div>

            {/* Video de receta */}
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200">
              {producto.video ? (
                <iframe
                  src={producto.video}
                  title="Receta recomendada"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-[315px] rounded-2xl"
                ></iframe>
              ) : (
                <p className="text-gray-500 p-6 text-center">
                  No hay video disponible para este producto.
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

    </>
  );
}
