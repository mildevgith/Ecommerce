import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // IMPORTANTE
import Navbar from "../components/Navbar";

import LangostinoHome from "../assets/imgsHero/LangostinoHome.jpeg";
import anillosHome from "../assets/imgsHero/anillosHome.jpeg";
import camaronHomepre from "../assets/imgsHero/camaronHomepre.jpeg";
import crustaceos from "../assets/imgsHero/crustaceos.jpeg";
import enteros from "../assets/imgsHero/enteros.jpeg";
import fileteTilapia from "../assets/imgsHero/fileteTilapia.jpeg";
import filetes from "../assets/imgsHero/filetes.jpeg";
import fishcate from "../assets/imgsHero/fishcate.jpeg";
import hero3 from "../assets/imgsHero/hero3.jpeg";
import mix from "../assets/imgsHero/mix.jpeg";
import postasSalmon from "../assets/imgsHero/postasSalmon.jpg";
import postaspargo from "../assets/imgsHero/postaspargo.jpeg";

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const data = [
      { id: 1, nombre: "Bagre", descripcion: "Deliciosas postas de Bagre Basa", precio: 18000, imagen: hero3 },
      { id: 2, nombre: "Anillos de calamar", descripcion: "Frescos para apanar y gratinar", precio: 32000, imagen: anillosHome },
      { id: 3, nombre: "Filete de Tilapia", descripcion: "Ideal para parrilla o ceviche", precio: 23000, imagen: fileteTilapia },
      { id: 4, nombre: "Postas de Salmón", descripcion: "Calidad premium", precio: 55000, imagen: postasSalmon },
      { id: 5, nombre: "Camarón Precocido", descripcion: "Pelado y desvenado, listo para cocinar", precio: 55000, imagen: camaronHomepre },
      { id: 6, nombre: "Camarón Crudo Limpio", descripcion: "Ideal para parrilla o ceviche", precio: 35000, imagen: crustaceos },
      { id: 7, nombre: "Pargo Rojo", descripcion: "Perfecto para encocado o frito", precio: 59000, imagen: enteros },
      { id: 8, nombre: "Filete de Corvina", descripcion: "Ideal para ceviche peruano", precio: 75000, imagen: filetes },
      { id: 9, nombre: "Mojarra Sesa", descripcion: "Perfecta para fritar o apanada", precio: 25000, imagen: fishcate },
      { id: 10, nombre: "Postas de Bagre de Río", descripcion: "Tradicional para sancocho", precio: 19000, imagen: hero3 },
      { id: 11, nombre: "Mixtura de Mariscos", descripcion: "Perfecta para cazuela o arroz marinero", precio: 28000, imagen: mix },
      { id: 12, nombre: "Postas de Robalo", descripcion: "Ideal para frito o sudado", precio: 75000, imagen: postaspargo },
    ];
    setProductos(data);
  }, []);

  // Paginación
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = productos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(productos.length / productsPerPage);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative w-full h-[70vh] sm:h-[75vh] flex items-center justify-center overflow-hidden shadow-md">
        <img src={mix} alt="Productos frescos del mar" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-black/25"></div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Productos frescos directamente del mar
          </h1>
          <p className="mt-3 sm:mt-4 text-md sm:text-lg md:text-xl text-white/90">
            Seleccionamos cuidadosamente cada producto para que tu cocina tenga siempre la mejor calidad.
          </p>

          <Link
            to="/productos"
            className="mt-6 sm:mt-8 inline-block bg-white/90 text-blue-800 px-6 sm:px-8 py-2 sm:py-3 rounded-3xl font-semibold text-sm sm:text-lg shadow-lg hover:bg-white hover:scale-105 hover:shadow-xl transition-all"
          >
            Ver Productos
          </Link>
        </div>

        {/* OLA */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 150" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#ffffff"
            d="M0,32L48,37.3C96,43,192,53,288,64C384,75,480,85,576,80C672,75,768,53,864,53.3C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,150L1392,150C1344,150,1248,150,1152,150C1056,150,960,150,864,150C768,150,672,150,576,150C480,150,384,150,288,150C192,150,96,150,48,150L0,150Z"
          ></path>
        </svg>
      </section>

      {/* PRODUCTOS */}
      <section className="container mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-blue-900 mb-10">Catálogo de Productos</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProducts.map((producto) => (
            <div key={producto.id} className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 group">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-56 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">{producto.nombre}</h3>
                <p className="text-gray-600 text-sm mb-4">{producto.descripcion}</p>
                <p className="text-blue-900 text-lg font-semibold mb-4">${producto.precio.toLocaleString("es-CO")}</p>

                <div className="flex justify-between items-center">
                  <Link
                    to="/carrito"
                    className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition flex justify-center"
                  >
                    Agregar al carrito
                  </Link>

                  <Link
                    to={`/productoDetalle/${producto.id}`} // Cambiado a productoDetalle
                    className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-sm hover:bg-blue-600 hover:text-white transition flex justify-center"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PAGINADOR */}
        <div className="flex justify-center items-center gap-3 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`px-4 py-2 rounded-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition ${currentPage === num ? "bg-blue-600 text-white" : ""}`}
            >
              {num}
            </button>
          ))}
        </div>

        {productos.length === 0 && <p className="text-center text-gray-500 mt-10">No hay productos disponibles en este momento.</p>}
      </section>
    </>
  );
}
