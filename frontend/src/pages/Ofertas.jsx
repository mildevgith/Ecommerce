// src/pages/Ofertas.jsx
import mix from "../assets/imgsHero/mix.jpeg";
import enteros from "../assets/imgsHero/enteros.jpeg";
import fileteTilapia from "../assets/imgsHero/fileteTilapia.jpeg";
import anillosHome from "../assets/imgsHero/anillosHome.jpeg";

export default function Ofertas() {
  const productos = [
    {
      id: 1,
      nombre: "Mixtura en oferta",
      precio: 18000,
      precioOriginal: 25000,
      imagen: mix,
    },
    {
      id: 2,
      nombre: "Pargo Rojo Entero",
      precio: 28000,
      precioOriginal: 39000,
      imagen: enteros,
    },
    {
      id: 3,
      nombre: "Filete de Tilapia Premium",
      precio: 19000,
      precioOriginal: 26000,
      imagen: fileteTilapia,

    },
    {
      id: 4,
      nombre: "Anillos de Calamar",
      precio: 15000,
      precioOriginal: 21000,
      imagen: anillosHome,

    },
      {
      id: 1,
      nombre: "Mixtura en oferta",
      precio: 18000,
      precioOriginal: 25000,
      imagen: mix,
    },
    {
      id: 2,
      nombre: "Pargo Rojo Entero",
      precio: 28000,
      precioOriginal: 39000,
      imagen: enteros,
    },
    {
      id: 3,
      nombre: "Filete de Tilapia Premium",
      precio: 19000,
      precioOriginal: 26000,
      imagen: fileteTilapia,

    },
    {
      id: 4,
      nombre: "Anillos de Calamar",
      precio: 15000,
      precioOriginal: 21000,
      imagen: anillosHome,

    },
  ];

  return (
    <div className="pt-24">
      {/* HERO superior */}
      <section className="relative bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#3949ab] text-white text-center py-16 px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
           Ofertas Especiales del Mes
        </h1>
        <p className="text-lg sm:text-xl max-w-2xl mx-auto opacity-90">
          Disfruta los mejores productos del mar con descuentos imperdibles.
        </p>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/fish-scales.png')] opacity-10"></div>
      </section>

      {/* Sección de ofertas */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-center text-[#1a237e] mb-10">
          Productos con Descuento
        </h2>

        {/* Grilla de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-52 object-cover"
                />
                <span className="absolute top-3 left-3 bg-[#ff9800] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  -{Math.round(
                    ((producto.precioOriginal - producto.precio) /
                      producto.precioOriginal) *
                      100
                  )}
                  %
                </span>
              </div>

              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {producto.nombre}
                </h3>
                <div className="flex justify-center items-center gap-2 mb-3">
                  <span className="text-[#ff9800] text-xl font-bold">
                    ${producto.precio.toLocaleString()}
                  </span>
                  <span className="text-gray-400 line-through text-sm">
                    ${producto.precioOriginal.toLocaleString()}
                  </span>
                </div>
                <button className="bg-[#1a237e] hover:bg-[#303f9f] text-white py-2 px-4 rounded-full text-sm transition">
                  Agregar al carrito 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Franja final de llamado a la acción */}
      <section className="bg-[#ff9800] text-white text-center py-12 mt-10">
        <h2 className="text-3xl font-bold mb-4">¡Aprovecha antes que se acaben! ⚡</h2>
        <p className="text-lg mb-6">Las mejores ofertas de pescados y mariscos frescos.</p>
        <a
          href="/productos"
          className="bg-white text-[#ff9800] font-semibold py-3 px-6 rounded-full hover:bg-[#fff3e0] transition"
        >
          Ver todos los productos
        </a>
      </section>
    </div>
  );
}

