// Importamos herramientas de animación para que la web no sea estática y aburrida
import { AnimatePresence, motion } from "framer-motion";
// Importamos iconos visuales de Lucide para mejorar la interfaz de usuario (UI)
import { Clock, MessageSquare, ShieldCheck, Truck } from "lucide-react";
// Importamos hooks esenciales de React: useEffect para efectos secundarios y useState para datos dinámicos
import { useEffect, useState } from "react";
// Importamos Link para navegar entre páginas sin que el navegador recargue toda la web (SPA)
import { Link } from "react-router-dom";

// Importamos las imágenes locales que se usarán específicamente para el carrusel principal (Hero)
import hero2 from "../assets/camaronprecoHero.jpg";
import hero3 from "../assets/Hero2.jpg";
import shirimhero from "../assets/shirimhero.jpg";

// Creamos un arreglo (array) con las imágenes importadas para poder iterar sobre ellas en el carrusel
const HERO_IMAGES = [shirimhero, hero2, hero3];

export default function Home() {
  // Estado para controlar cuál imagen del carrusel se está mostrando actualmente (empieza en 0)
  const [index, setIndex] = useState(0);
  // Estado para guardar la lista de categorías que traeremos desde la base de datos de Django
  const [categories, setCategories] = useState([]);
  // Estado para guardar los productos marcados como "destacados" en nuestro backend
  const [productosDestacados, setProductosDestacados] = useState([]);

  // Definimos la dirección raíz de nuestro servidor Django (donde vive la base de datos)
  const BASE_URL = "http://localhost:8000";
  // Definimos la ruta específica de nuestra API para hacer las consultas (Fetch)
  const API_URL = `${BASE_URL}/api`;

  // Variable con el número de WhatsApp de Expomarket (Cali) para contacto directo
  const whatsappNumber = "5733174262521";
  // Creamos el link de WhatsApp codificando el mensaje para que los espacios no rompan la URL
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("¡Hola Expomarket! Me interesa información para mi negocio.")}`;

  // useEffect que se ejecuta una vez al cargar la página para iniciar el temporizador del carrusel
  useEffect(() => {
    // Creamos un intervalo que cambia el índice de la imagen cada 6 segundos (6000ms)
    const timer = setInterval(() => {
      // Usamos el residuo (%) para que al llegar a la última imagen, vuelva a empezar desde 0
      setIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    // Limpiamos el intervalo cuando el usuario sale de la página para evitar fugas de memoria
    return () => clearInterval(timer);
  }, []); // El arreglo vacío [] asegura que esto solo se ejecute al montar el componente

  // useEffect para pedir los datos reales al servidor Django apenas el usuario entre a la web
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Pedimos las categorías a Django y esperamos la respuesta (await)
        const resCat = await fetch(`${API_URL}/categorias/`);
        // Convertimos la respuesta de texto plano a un objeto JSON que React entienda
        const dataCat = await resCat.json();
        // Guardamos esas categorías en nuestro estado para usarlas en el diseño
        setCategories(dataCat);

        // Pedimos la lista completa de productos al backend
        const resProd = await fetch(`${API_URL}/productos/`);
        // Convertimos la respuesta de productos a JSON
        const dataProd = await resProd.json();
        // Filtramos solo los productos que tengan el campo "es_destacado" como verdadero (True)
        const destacados = dataProd.filter(p => p.es_destacado === true);
        // Si hay destacados, mostramos máximo 4; si no hay, mostramos los primeros 4 que existan
        setProductosDestacados(destacados.length > 0 ? destacados.slice(0, 4) : dataProd.slice(0, 4));
      } catch (error) {
        // Si el servidor está apagado o hay un error, lo mostramos en la consola para debugging
        console.error("Error conectando con Django:", error);
      }
    };
    // Llamamos a la función asíncrona definida arriba
    fetchData();
  }, []);

  // Función de ayuda para arreglar las rutas de las imágenes que vienen de Django Media
  const getImageUrl = (url) => {
    // Si el producto no tiene imagen, devolvemos una imagen de relleno (placeholder)
    if (!url) return "https://via.placeholder.com/400x300?text=Expomarket";
    // Si la URL ya es completa (empieza por http), la usamos; si es relativa, le pegamos la BASE_URL delante
    return url.startsWith("http") ? url : `${BASE_URL}${url}`;
  };

  return (
    // Contenedor principal con fondo gris muy suave y selección de texto en color naranja
    <main className="min-h-screen bg-slate-50/50 selection:bg-orange-200">

      {/* --- SECCIÓN 1: HERO (EL BANNER PRINCIPAL ANIMADO) --- */}
      <section className="relative h-[95vh] w-full overflow-hidden bg-black">
        {/* AnimatePresence permite que Framer Motion anime las imágenes cuando aparecen y desaparecen */}
        <AnimatePresence mode="wait">
          {/* Componente de movimiento para la imagen actual del carrusel */}
          <motion.div
            key={index} // La "key" le dice a React que este elemento es nuevo cada vez que el index cambia
            initial={{ opacity: 0, scale: 1.1 }} // Empieza invisible y un poco más grande
            animate={{ opacity: 1, scale: 1 }} // Se vuelve visible y vuelve a su tamaño normal
            exit={{ opacity: 0 }} // Se desvanece al salir
            transition={{ duration: 1.2, ease: "easeOut" }} // La transición dura 1.2 segundos y es suave
            className="absolute inset-0" // Ocupa todo el espacio del contenedor padre
          >
            {/* Imagen del hero con opacidad al 60% para que el texto blanco resalte mejor */}
            <img src={HERO_IMAGES[index]} className="h-full w-full object-cover opacity-60" alt="Expomarket" />
            {/* Capa oscura con degradado de negro a transparente para darle profundidad visual */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Contenedor del texto central del Hero */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          {/* Título principal con animación de entrada desde abajo (y: 30) */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            Frescura que se <br />
            {/* Texto con degradado de naranja a ámbar usando técnicas de CSS moderno */}
            <span className="bg-gradient-to-r from-orange-400 to-amber-600 bg-clip-text text-transparent">
              siente en cada bocado
            </span>
          </motion.h1>

          {/* Botones de acción (Call to Action) con un pequeño retraso (delay: 0.4) para que salgan después del título */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            {/* Botón naranja que lleva al catálogo interno */}
            <Link to="/productos" className="rounded-full bg-orange-500 px-10 py-4 font-extrabold text-white shadow-lg shadow-orange-500/40 hover:bg-orange-600 hover:scale-105 transition-all text-lg">
              🛒 Ver Catálogo
            </Link>
            {/* Botón verde que abre WhatsApp en una pestaña nueva (target="_blank") */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-500 px-10 py-4 font-extrabold text-white shadow-lg shadow-green-500/40 hover:bg-green-600 hover:scale-105 transition-all text-lg flex items-center justify-center gap-2">
              <MessageSquare size={22} /> Pedir por WhatsApp
            </a>
          </motion.div>
        </div>
      </section>

      {/* --- SECCIÓN 2: STATS (VALORES AGREGADOS DE LA MARCA) --- */}
      <section className="bg-white py-12 border-b">
        {/* Grid que se divide en 1 columna en móvil y 3 columnas en computadores */}
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Bloque de Logística */}
          <div className="flex flex-col items-center">
            <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600"><Truck size={30}/></div>
            <h3 className="font-bold text-slate-900">Envíos en Cali</h3>
            <p className="text-sm text-slate-500">Llegamos a todo el sur de la ciudad.</p>
          </div>
          {/* Bloque de Calidad con bordes laterales en pantallas medianas */}
          <div className="flex flex-col items-center border-x border-slate-100">
            <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600"><ShieldCheck size={30}/></div>
            <h3 className="font-bold text-slate-900">Calidad Premium</h3>
            <p className="text-sm text-slate-500">Productos seleccionados rigurosamente.</p>
          </div>
          {/* Bloque de Garantía */}
          <div className="flex flex-col items-center">
            <div className="mb-4 p-3 bg-orange-100 rounded-2xl text-orange-600"><Clock size={30}/></div>
            <h3 className="font-bold text-slate-900">Cadena de Frío</h3>
            <p className="text-sm text-slate-500">Garantizamos la temperatura ideal.</p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: CATEGORÍAS REALES (GENERADAS DESDE DJANGO) --- */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <h2 className="text-sm font-bold uppercase tracking-widest text-orange-500 mb-2">Categorías</h2>
        <p className="text-4xl font-extrabold text-slate-900 mb-12">¿Qué se te antoja hoy?</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Usamos .map para crear una tarjeta por cada categoría que nos devolvió el servidor */}
          {categories.map((cat) => (
            <motion.div key={cat.id} whileHover={{ y: -8 }} className="relative overflow-hidden rounded-3xl bg-slate-200 h-80 group">
              {/* Imagen de la categoría con efecto de zoom al pasar el mouse (group-hover) */}
              <img src={getImageUrl(cat.imagen)} className="h-full w-full object-cover transition-transform group-hover:scale-110" alt={cat.nombre} />
              {/* Overlay oscuro para que el nombre de la categoría sea legible */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-2xl font-bold text-white uppercase">{cat.nombre}</h3>
                {/* Link dinámico que lleva a la página específica de esa categoría usando su ID */}
                <Link to={`/categoria/${cat.id}`} className="text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver selección premium →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- SECCIÓN 4: PRODUCTOS DESTACADOS REALES --- */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-3xl font-bold mb-10 text-slate-900">Nuestros Recomendados</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Recorremos la lista de productos destacados filtrados en el useEffect */}
          {productosDestacados.map((producto) => (
            <div key={producto.id} className="group relative rounded-2xl bg-white p-3 border shadow-sm hover:shadow-md transition-all">
              {/* Contenedor de la imagen del producto */}
              <div className="relative overflow-hidden rounded-xl h-64">
                <img src={getImageUrl(producto.imagen)} className="h-full w-full object-cover group-hover:scale-110 transition-transform" alt={producto.nombre} />
              </div>
              {/* Información del producto: Nombre y Precio formateado a moneda colombiana */}
              <div className="mt-4 p-2 text-center">
                <h3 className="text-lg font-bold text-slate-800">{producto.nombre}</h3>
                <p className="mt-1 text-orange-500 font-bold text-xl">
                  {/* Convertimos el número a formato de dinero (ej: 45000 -> $45.000) */}
                  ${Number(producto.precio).toLocaleString('es-CO')} <span className="text-xs text-slate-400">/ Kg</span>
                </p>
                {/* Botón de acción rápida para compras */}
                <button className="mt-4 w-full rounded-xl bg-slate-900 py-3 font-bold text-white hover:bg-orange-500 transition-colors">
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- SECCIÓN 5: BANNER MAYORISTAS (EL LADO PROFESIONAL DE EXPOMARKET) --- */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        {/* Contenedor oscuro con esquinas muy redondeadas y padding generoso */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative">
          {/* Lado izquierdo: Texto informativo para empresas */}
          <div className="flex-1 z-10">
            <span className="text-orange-500 font-bold uppercase text-sm">B2B Expomarket</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-6">¿Surtimos tu negocio?</h2>
            <p className="text-slate-400 mb-8 max-w-md">Precios especiales para restaurantes y pescaderías en Cali. Calidad y cumplimiento garantizado.</p>
            {/* Botón de WhatsApp especializado en ventas mayoristas */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all">
              <MessageSquare size={20}/> Hablar con un asesor
            </a>
          </div>
          {/* Lado derecho: Elementos decorativos y una imagen destacada con inclinación */}
          <div className="flex-1 relative">
             {/* Un círculo naranja difuminado de fondo para dar un efecto de "glow" o brillo */}
             <div className="w-64 h-64 bg-orange-500/20 rounded-full blur-3xl absolute -top-10 -right-10"></div>
             {/* Imagen con una ligera rotación (rotate-3) que se endereza al pasar el mouse */}
             <img src={shirimhero} className="rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" alt="Suministro B2B" />
          </div>
        </div>
      </section>

    </main>
  );
}
