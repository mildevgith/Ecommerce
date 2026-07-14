import { Link } from "react-router-dom"; // Importo Link para navegación interna

export default function ProductoCard({ producto }) {
  return (
    /* Contenedor de la Tarjeta:
       - rounded-2xl: bordes suaves que combinan con el Navbar.
       - overflow-hidden: evita que la imagen se salga de los bordes redondeados.
       - transition duration-300: hace que el efecto de sombra al pasar el mouse sea fluido.
    */
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">

      {/* IMAGEN: object-cover asegura que la foto no se estire feo si el tamaño varía */}
      <img
        src={producto.imagen} // Fuente de la imagen del producto
        alt={producto.nombre} // Texto descriptivo para accesibilidad
        className="w-full h-48 object-cover" // Ocupa el ancho total con altura fija
      />

      {/* CONTENIDO TEXTUAL */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {producto.nombre} // Muestra el nombre del producto
        </h2>

        {/* Descripción corta:
            line-clamp-2 es un truco de Tailwind vital: si el texto es muy largo,
            pone puntos suspensivos (...) y corta en la segunda línea para que
            todas las tarjetas midan lo mismo.
        */}
        {producto.descripcion && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">
            {producto.descripcion} // Renderizo la descripción solo si existe
          </p>
        )}

        {/* FOOTER DE LA TARJETA (Precio y Acción) */}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-blue-600 font-bold text-lg">
            {/* .toLocaleString() pone los puntos de miles automáticamente */}
            ${producto.precio.toLocaleString()}
          </span>

          {/* BOTÓN DINÁMICO:
              Usa template strings (las comillas invertidas ``) para meter el ID
              en la URL y que React Router sepa a qué producto ir.
          */}
          <Link
            to={`/producto/${producto.id}`} // Redirección dinámica según el ID del producto
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  );
}