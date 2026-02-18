
export default function Checkout() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center pt-24 pb-12 px-4">
      {/* Contenedor principal */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-200">

        {/* Título */}
        <h1 className="text-4xl font-extrabold text-center text-[#242a57] mb-10">
          Finalizar Compra
        </h1>

        {/* Formulario */}
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              placeholder="Ingresa tu nombre completo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="Ejemplo: correo@dominio.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Teléfono de contacto
            </label>
            <input
              type="tel"
              placeholder="Ejemplo: +57 320 123 4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Dirección de envío
            </label>
            <input
              type="text"
              placeholder="Calle 10 #20-15, Bogotá"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              placeholder="Ciudad"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a237e]"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full mt-4 bg-[#1a237e] text-white py-3 rounded-lg font-semibold hover:bg-[#283593] transition duration-300"
          >
            Confirmar Pedido
          </button>
        </form>
      </div>
    </div>
  );
}
