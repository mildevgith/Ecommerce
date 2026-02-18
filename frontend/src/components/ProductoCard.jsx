import { Link } from "react-router-dom";

export default function ProductoCard({ producto }) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {/* Imagen del producto */}
      <img
        src={producto.imagen}
        alt={producto.nombre}
        className="w-full h-48 object-cover"
      />

      {/* Contenido del producto */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {producto.nombre}
        </h2>

        {producto.descripcion && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {producto.descripcion}
          </p>
        )}

        <div className="mt-3 flex justify-between items-center">
          <span className="text-blue-600 font-bold text-lg">
            ${producto.precio.toLocaleString()}
          </span>

          {/* Botón de ver detalle */}
          <Link
            to={`/producto/${producto.id}`} // 👈 ruta dinámica
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  );
}
