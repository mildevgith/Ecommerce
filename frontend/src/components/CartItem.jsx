// Exporto la función CartItem que recibe tres cosas (props):
// 1. item: la info del producto (nombre, precio, imagen, cantidad)
// 2. onAdd: la función que dispara el botón de "+"
// 3. onRemove: la función que dispara el botón de "-"
export default function CartItem({ item, onAdd, onRemove }) {
  return (
    // Contenedor principal con flexbox para alinear la info a la izquierda y botones a la derecha
    <div className="flex items-center justify-between border-b py-4">

      {/* SECCIÓN IZQUIERDA: Foto y Datos del producto */}
      <div className="flex items-center gap-4">
        <img
          src={item.imagen} // La URL que viene desde Django (media/)
          alt={item.nombre}
          className="w-20 h-20 object-cover rounded-lg" // Tamaño fijo y bordes redondeados
        />
        <div>
          <h3 className="font-semibold text-gray-800">{item.nombre}</h3>
          {/* .toFixed(2) asegura que el precio siempre tenga dos decimales (Ej: 15.00) */}
          <p className="text-sm text-gray-500">${item.precio.toFixed(2)}</p>
        </div>
      </div>

      {/* SECCIÓN DERECHA: Controles de cantidad */}
      <div className="flex items-center gap-3">
        {/* Botón de resta: Al hacer clic, llama a la función onRemove pasando el ID del producto */}
        <button
          onClick={() => onRemove(item.id)}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          −
        </button>

        {/* Muestra el número actual de unidades que el cliente quiere llevar */}
        <span className="font-semibold">{item.cantidad}</span>

        {/* Botón de suma: Al hacer clic, llama a onAdd pasando el ID */}
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
