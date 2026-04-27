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
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* El círculo de fondo con opacidad baja */}
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        {/* La "llave" o arco que se ve girando con más color */}
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8z"
        ></path>
      </svg>

      {/* Texto de apoyo para el usuario */}
      <p className="font-semibold text-lg">Cargando...</p>
    </div>
  );
}
