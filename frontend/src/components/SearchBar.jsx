// src/components/SearchBar.jsx
import { Search } from "lucide-react"; // Usamos lucide para mantener la estética profesional
import { useState } from "react";

export default function SearchBar({ onSearch }) {
  // Estado local para capturar el texto que el usuario escribe
  const [query, setQuery] = useState("");

  // Función que se dispara al presionar Enter o hacer clic en la lupa
  const handleSubmit = (e) => {
    e.preventDefault(); // Evita que la página se recargue (comportamiento por defecto de HTML)
    onSearch(query);    // Le envía el texto a la función que viene del componente padre
  };

  return (
    <form
      onSubmit={handleSubmit}
      /* Centrado automático con mx-auto y un ancho máximo para que no se vea gigante en PC */
      className="flex items-center justify-center gap-2 w-full max-w-md mx-auto mb-6"
    >
      <input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        // Cada vez que el usuario presiona una tecla, actualizamos el estado
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {/* El icono de la lupa de lucide-react */}
        <Search size={20} />
      </button>
    </form>
  );
}
