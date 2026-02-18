import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import hero3 from "../assets/imgsHero/hero3.jpeg";

export default function ProductoCategoria() {
  const { categoria } = useParams(); // Obtenemos el parámetro de la URL
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Aquí deberías llamar a tu API filtrando por categoría
    // Ejemplo temporal para prueba:
   const productosMock = [
      { id: 1, nombre: "Camarón Precocido", precio: "$35.000 / Kg", imagen: "/img/camaronHomepre.jpeg", categoria: "mariscos" },
      { id: 2, nombre: "Langostino", precio: "$68.000 / Kg", imagen: "/img/langostinoHome.jpeg", categoria: "mariscos" },
      { id: 3, nombre: "Filete de Pescado", precio: "$25.000 / Kg", imagen: "/img/filetes.jpeg", categoria: "filetes-de-pescado" },
      { id: 4, nombre: "Pescado Entero", precio: "$18.000 / Kg", imagen: hero3, categoria: "pescados-enteros" },
      { id: 5, nombre: "Aros de Calamar", precio: "$22.000 / Kg", imagen: "/img/anillosHome.jpeg", categoria: "complementos" },
    ];

    const filtrados = productosMock.filter(
      (p) => p.categoria.toLowerCase() === categoria.toLowerCase()
    );

    setProductos(filtrados);
  }, [categoria]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
        Productos en{" "}
        <span className="text-[#ff9800] capitalize">
          {categoria.replace("-", " ")}
        </span>
      </h2>

      {productos.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {productos.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-500"
            >
              <img
                src={prod.imagen}
                alt={prod.nombre}
                className="w-full h-56 sm:h-64 object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {prod.nombre}
                </h3>
                <p className="text-[#ff9800] font-bold mt-2">{prod.precio}</p>
                <button className="mt-4 w-full bg-[#1a237e] hover:bg-[#283593] text-white py-2 rounded-full font-semibold transition transform hover:scale-105">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
