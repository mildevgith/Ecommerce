import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProductoCategoria() {
  const { categoria } = useParams();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
  // 1. Definimos la función para traer datos de Django
  const obtenerProductos = async () => {
    try {
      // Usamos tu endpoint real (ajusta la URL si es necesario)
      const respuesta = await fetch(`http://localhost:8000/api/productos/?categoria=${categoria}`);
      const datos = await respuesta.json();

      // 2. Guardamos los datos reales en el estado
      setProductos(datos);
    } catch (error) {
      console.error("Error conectando con la API de Expomarket:", error);
    }
  };

  obtenerProductos();
}, [categoria]); // Se ejecuta cada vez que cambias de categoría

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
