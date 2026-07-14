// Defino el componente funcional Loader
export default function Loader() {
  return (
    /* Contenedor principal:
       - items-center justify-center: Centra el círculo y el texto perfectamente.
       - h-64: Le da una altura moderada para que no salte bruscamente cuando aparezca el contenido.
    */
    <div className="flex flex-col items-center justify-center h-64 text-blue-700">

      {/* Icono de carga (Spinner) usando SVG */}
      <svg
        /* animate-spin: Esta clase de Tailwind hace que el icono gire infinitamente */
        className="animate-spin h-12 w-12 text-blue-600 mb-3"
        xmlns="http://www.w3.org/2000/svg" // Define el espacio de nombres XML para SVG
        fill="none" // Indica que no debe rellenarse el contenedor principal
        viewBox="0 0 24 24" // Define las coordenadas del canvas interno
      >
        {/* El círculo de fondo con opacidad baja */}
        <circle
          className="opacity-25" // Opacidad reducida para el borde inactivo
          cx="12" // Posición central horizontal
          cy="12" // Posición central vertical
          r="10" // Radio del círculo
          stroke="currentColor" // Hereda el color del texto definido en el padre
          strokeWidth="4" // Grosor del trazo del borde
        ></circle>
        {/* La "llave" o arco que se ve girando con más color */}
        <path
          className="opacity-75" // Opacidad mayor para el trazo activo
          fill="currentColor" // Relleno con el color heredado
          d="M4 12a8 8 0 018-8v8z" // Ruta (path) geométrica que dibuja el arco de carga
        ></path>
      </svg>

      {/* Texto de apoyo para el usuario */}
      <p className="font-semibold text-lg">Cargando...</p>
    </div>
  );
}