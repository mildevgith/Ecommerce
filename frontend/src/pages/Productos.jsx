// src/pages/Productos.jsx
// Importamos los hooks de React: useEffect para peticiones y useState para manejar estados locales
import { useEffect, useState } from "react";
// Importamos componentes de navegación: Link para enlaces y useLocation para leer la URL (buscador)
import { Link, useLocation } from "react-router-dom";
// Importamos el componente de navegación superior
import Navbar from "../components/Navbar";
// Importamos axios, que es la librería que usamos para conectarnos al backend de Django de forma sencilla
import axios from "axios";
// Importamos la imagen de fondo para el banner de la página de productos
import mix from "../assets/mix.jpeg";

export default function Productos() {
  // Estado para almacenar la lista de productos que vienen de la base de datos (PostgreSQL)
  const [productos, setProductos] = useState([]);
  // Estado booleano para mostrar un mensaje de "Cargando..." mientras llega la respuesta del servidor
  const [loading, setLoading] = useState(true);
  // Estado para controlar en qué página del catálogo estamos actualmente
  const [currentPage, setCurrentPage] = useState(1);
  // Definimos que queremos mostrar exactamente 6 productos por cada página
  const productsPerPage = 6;

  // Hook para obtener la información de la ruta actual (ej: si el usuario buscó algo)
  const location = useLocation();
  // Extraemos los parámetros de búsqueda de la URL (lo que va después del ?)
  const queryParams = new URLSearchParams(location.search);
  // Obtenemos el valor del parámetro "search". Si no existe, queda como un texto vacío ""
  const searchTerm = queryParams.get("search") || "";

  // useEffect se dispara cada vez que el término de búsqueda (searchTerm) cambie
  useEffect(() => {
    // Definimos una función asíncrona para traer los datos sin bloquear la web
    const obtenerProductos = async () => {
      // Activamos el estado de carga antes de empezar la petición
      setLoading(true);
      try {
        // Ruta base de tu API en Django
        const base_url = "http://localhost:8000/api/productos/";
        // Si el usuario buscó algo, añadimos el filtro de búsqueda a la URL; si no, usamos la base
        const url = searchTerm
          ? `${base_url}?search=${encodeURIComponent(searchTerm)}`
          : base_url;

        // Hacemos la petición GET al servidor de Django usando axios
        const response = await axios.get(url);
        // Guardamos los datos recibidos (la lista de productos) en nuestro estado
        setProductos(response.data);
        // Si el usuario busca algo nuevo, lo devolvemos a la página 1 para que vea los resultados desde el inicio
        setCurrentPage(1);
      } catch (error) {
        // Si hay un error (ej: servidor apagado), lo mostramos en la consola para revisar
        console.error("Error al conectar con la base de datos:", error);
      } finally {
        // Pase lo que pase, quitamos el mensaje de "Cargando..." al terminar
        setLoading(false);
      }
    };
    // Ejecutamos la función de carga de productos
    obtenerProductos();
  }, [searchTerm]); // El array de dependencia indica que si searchTerm cambia, se repite todo el proceso

  // --- Lógica manual de paginación ---
  // Calculamos el índice del último producto de la página actual (ej: página 2 * 6 = 12)
  const indexOfLast = currentPage * productsPerPage;
  // Calculamos el índice del primer producto de la página actual (ej: 12 - 6 = 6)
  const indexOfFirst = indexOfLast - productsPerPage;
  // Cortamos el array original de productos para mostrar solo los 6 que corresponden a esta página
  const currentProducts = productos.slice(indexOfFirst, indexOfLast);
  // Calculamos el número total de páginas dividiendo total de productos entre 6 (redondeando hacia arriba)
  const totalPages = Math.ceil(productos.length / productsPerPage);

  return (
    <>
      {/* Insertamos la barra de navegación en la parte superior */}
      <Navbar />

      {/* SECCIÓN HERO: Banner visual de la página de productos */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden shadow-md">
        {/* Imagen de fondo ocupando todo el espacio con opacidad para resaltar el texto */}
        <img src={mix} alt="Productos frescos" className="absolute inset-0 w-full h-full object-cover opacity-80" />
        {/* Capa oscura (overlay) para mejorar la legibilidad del título */}
        <div className="absolute inset-0 bg-black/25"></div>
        {/* Contenedor del título principal */}
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Productos frescos directamente del mar
          </h1>
        </div>
        {/* SVG decorativo en la base del banner para crear un efecto de onda o corte limpio */}
        <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 150" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ffffff" d="M0,32L1440,64L1440,150L0,150Z"></path>
        </svg>
      </section>

      {/* SECCIÓN DE CATÁLOGO: Donde se muestran las tarjetas de productos */}
      <section className="container mx-auto px-4 py-14">
        {/* Título dinámico: cambia si estamos viendo resultados de búsqueda o el catálogo completo */}
        <h2 className="text-2xl font-bold text-blue-900 mb-10">
          {searchTerm ? `Resultados para: "${searchTerm}"` : "Catálogo de Productos"}
        </h2>

        {/* Renderizado condicional: si está cargando muestra el texto, si no, muestra los productos */}
        {loading ? (
          <div className="text-center py-10">Cargando productos...</div>
        ) : (
          <>
            {/* Grid responsivo: 1 columna en móvil, 2 en tablet y 3 en pantallas grandes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Recorremos solo los productos de la página actual para crear las tarjetas */}
              {currentProducts.map((producto) => (
                <div key={producto.id} className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all group">
                  {/* Imagen del producto traída desde la URL de Django Media */}
                  <img src={producto.imagen} alt={producto.nombre} className="w-full h-56 object-cover" />
                  <div className="p-5">
                    {/* Nombre, descripción y precio formateado a moneda colombiana */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{producto.nombre}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{producto.descripcion}</p>
                    <p className="text-blue-900 text-lg font-semibold mb-4">${producto.precio.toLocaleString("es-CO")}</p>
                    {/* Botones de acción: uno para el carrito y otro para ver el detalle técnico */}
                    <div className="flex justify-between gap-2">
                      <Link to="/carrito" className="bg-blue-600 text-white px-4 py-2 rounded-full text-xs hover:bg-blue-700 transition">Agregar</Link>
                      <Link to={`/productoDetalle/${producto.id}`} className="border border-blue-600 text-blue-600 px-4 py-2 rounded-full text-xs hover:bg-blue-600 hover:text-white transition">Detalles</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SECCIÓN DE PAGINACIÓN: Solo aparece si hay más de una página de resultados */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-10">
                {/* Creamos un array vacío con el tamaño de totalPages y lo recorremos para crear los botones numéricos */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    // Al hacer click, actualizamos el estado currentPage y React vuelve a filtrar el slice
                    onClick={() => setCurrentPage(num)}
                    // Aplicamos estilos diferentes si el botón es el de la página activa
                    className={`px-4 py-2 rounded-full border border-blue-600 ${currentPage === num ? "bg-blue-600 text-white" : "text-blue-600"}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            )}

            {/* Mensaje de error amigable por si la búsqueda no arroja ningún resultado en la BD */}
            {productos.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No encontramos productos para "{searchTerm}".
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
