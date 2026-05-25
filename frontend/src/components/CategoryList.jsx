import React from 'react';

/**
 * @typedef {Object} Categoria
 * @property {number} id
 * @property {string} nombre
 * @property {string} imagen
 */

/**
 * Componente que renderiza la lista de categorías en la Home
 * @param {{ categories: Categoria[], onSelect: (nombre: string) => void }} props
 */
export default function CategoryList({ categories = [], onSelect }) {
  return (
    /* Contenedor en cuadrícula (Grid):
        - 2 columnas en celular (grid-cols-2)
        - 3 en tablet (sm)
        - 4 en PC (md)
        - gap-4: espacio entre tarjetas
    */
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-8">

      {/* Recorro la lista de categorías una por una de forma segura */}
      {categories && categories.map((cat) => (
        <button
          key={cat.id} // "DNI" único para que React sepa cuál botón es cuál
          onClick={() => onSelect && onSelect(cat.nombre)} // Al hacer clic, le aviso al padre qué categoría eligieron

          /* Estilos de la tarjeta:
              - shadow-md: sombra suave profesional.
              - rounded-xl: bordes muy redondeados (look moderno).
              - hover:scale-105: el efecto de que la tarjeta "salta" un poco al pasar el mouse.
          */
          className="flex flex-col items-center bg-white shadow-md rounded-xl p-4 hover:shadow-lg hover:scale-105 transition"
        >
          {/* Imagen circular de la categoría */}
          <img
            src={cat.imagen || "https://via.placeholder.com/150?text=Expomarket"} // Fallback por si no trae imagen
            alt={cat.nombre}
            className="w-20 h-20 object-cover rounded-full mb-2" // rounded-full la hace un círculo perfecto
          />

          {/* Nombre de la categoría debajo de la imagen */}
          <span className="font-semibold text-gray-700">{cat.nombre}</span>
        </button>
      ))}
    </div>
  );
}