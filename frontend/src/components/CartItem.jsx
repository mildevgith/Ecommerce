// Exporto la función CartItem que recibe tres cosas (props):
// 1. item: la info del producto (nombre, precio, imagen, cantidad)
// 2. onAdd: la función que dispara el botón de "+"
// 3. onRemove: la función que dispara el botón de "-"
export default function CartItem({ item, onAdd, onRemove }) {
  // Retorna el JSX que representa la estructura visual del componente
  return (
    // Contenedor principal con flexbox para alinear la info a la izquierda y botones a la derecha
    <div className="flex items-center justify-between border-b py-4">

      {/* Foto y Datos del producto */}
      <div className="flex items-center gap-4">
        {/* Imagen del producto con estilos de tamaño y bordes */}
        <img
          src={item.imagen} // La URL que viene desde Django (media/)
          alt={item.nombre} // Texto alternativo para accesibilidad
          className="w-20 h-20 object-cover rounded-lg" // Tamaño fijo y bordes redondeados
        />
        {/* Contenedor de texto para nombre y precio */}
        <div>
          <h3 className="font-semibold text-gray-800">{item.nombre}</h3>
          {/* .toFixed(2) asegura que el precio siempre tenga dos decimales (Ej: 15.00) */}
          <p className="text-sm text-gray-500">${item.precio.toFixed(2)}</p>
        </div>
      </div>

      {/*Controles de cantidad */}
      <div className="flex items-center gap-3">
        {/* Botón de resta: Al hacer clic, llama a la función onRemove pasando el ID del producto */}
        <button
          onClick={() => onRemove(item.id)} // Dispara la función onRemove con el ID
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300" // Estilos de botón
        >
          − // Carácter de resta
        </button>

        {/* Muestra el número actual de unidades que el cliente quiere llevar */}
        <span className="font-semibold">{item.cantidad}</span>

        {/* Botón de suma: Al hacer clic, llama a onAdd pasando el ID */}
        <button
          onClick={() => onAdd(item.id)} // Dispara la función onAdd con el ID
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700" // Estilos de botón
        >
          + // Carácter de suma
        </button>
      </div>
    </div>
  );
}