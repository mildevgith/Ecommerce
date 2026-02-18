// src/components/SearchBar.jsx
import { useState } from "react";
import { Search } from "lucide-react"; // icono moderno

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  // Función que se ejecuta al enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query); // envía el texto al componente padre
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center gap-2 w-full max-w-md mx-auto mb-6"
    >
      <input
        type="text"
        placeholder="Buscar productos..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Search size={20} />
      </button>
    </form>
  );
}
