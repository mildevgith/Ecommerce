// src/components/CategoryList.jsx
export default function CategoryList({ categories, onSelect }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 my-8">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.nombre)}
          className="flex flex-col items-center bg-white shadow-md rounded-xl p-4 hover:shadow-lg hover:scale-105 transition"
        >
          <img
            src={cat.imagen}
            alt={cat.nombre}
            className="w-20 h-20 object-cover rounded-full mb-2"
          />
          <span className="font-semibold text-gray-700">{cat.nombre}</span>
        </button>
      ))}
    </div>
  );
}
