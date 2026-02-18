// src/components/CartItem.jsx
export default function CartItem({ item, onAdd, onRemove }) {
  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center gap-4">
        <img
          src={item.imagen}
          alt={item.nombre}
          className="w-20 h-20 object-cover rounded-lg"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{item.nombre}</h3>
          <p className="text-sm text-gray-500">${item.precio.toFixed(2)}</p>
        </div>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onRemove(item.id)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          −
        </button>
        <span className="font-semibold">{item.cantidad}</span>
        <button
          onClick={() => onAdd(item.id)}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          +
        </button>
      </div>
    </div>
  );
}
