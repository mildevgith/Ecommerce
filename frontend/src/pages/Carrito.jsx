import {
  ArrowLeft,
  CreditCard,
  Minus,
  Plus,
  ShoppingBag,
  Ticket,
  Trash2,
  Truck,
} from "lucide-react"; // Importo iconos necesarios e iconos de cupones/envío
import { Link } from "react-router-dom"; // Importo componente de navegación
import { useCart } from "../context/CartContext"; // Importo el hook para acceder al estado del carrito

export default function Carrito() {
  // Extraigo las funciones y el estado del carrito desde el contexto (INTACTO)
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  // Cálculo del precio total base: suma del producto (precio * cantidad) de cada item
  const total = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  // Costo de envío simulado (puedes cambiarlo o adaptarlo a tu backend después)
  const costoEnvio = total > 150000 ? 0 : 8000;

  return (
    // Contenedor principal con fondo gris claro y altura mínima de pantalla
    <div className="pt-20 pb-10 md:pt-28 md:pb-20 px-4 min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado adaptable: se centra y ajusta el tamaño del icono */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <div className="bg-orange-500/10 p-3 rounded-full mb-3">
            <ShoppingBag className="text-orange-600 w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black">Tu Carrito</h2>
          <p className="text-slate-500 text-sm md:text-base">
            Revisa tus productos antes de pagar
          </p>
        </div>

        {/* Renderizado condicional: muestra estado vacío o el contenido del carrito */}
        {cart.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center bg-white border py-12 px-6 rounded-3xl shadow-sm">
            <p className="text-lg text-slate-600 mb-6 font-medium">
              Tu carrito está vacío.
            </p>
            <Link
              to="/ofertas"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold w-full sm:w-auto justify-center"
            >
              <ArrowLeft size={18} /> Explorar Tienda
            </Link>
          </div>
        ) : (
          /* NUEVO LAYOUT: Grid de 3 columnas en escritorio (2 para productos, 1 para resumen) */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* COLUMNA IZQUIERDA: Lista de Productos (Ocupa 2 columnas en lg) */}
            <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-100">
              {/* Cabecera de la lista de productos */}
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="font-bold text-slate-700">
                  Items ({cart.length})
                </h3>
                <button
                  onClick={clearCart}
                  className="text-red-500 text-xs font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} /> Vaciar
                </button>
              </div>

              {/* LISTA DE PRODUCTOS: Mapeo de cada elemento en el carrito */}
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-row items-start gap-3 md:gap-6 border-b border-slate-50 pb-6 last:border-0"
                  >
                    {/* Imagen del producto (Mantiene tus mismas clases e item.imagen) */}
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-sm"
                    />

                    <div className="flex-1 flex flex-col justify-between min-h-[80px] md:min-h-[96px]">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm md:text-lg line-clamp-1">
                            {item.nombre}
                          </h4>
                          <p className="text-orange-600 font-black text-xs md:text-sm">
                            ${item.precio?.toLocaleString("es-CO")}{" "}
                            <span className="text-slate-400 font-normal text-xs">
                              / Unid
                            </span>
                          </p>
                        </div>
                        {/* NUEVO: Subtotal por línea de producto en la esquina derecha */}
                        <div className="text-right hidden sm:block">
                          <span className="text-xs text-slate-400 font-medium">
                            Subtotal
                          </span>
                          <p className="font-bold text-slate-800 text-sm md:text-base">
                            $
                            {(item.precio * item.cantidad).toLocaleString(
                              "es-CO",
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Controles: Ajuste de cantidad y botón eliminar (FUNCIONES INTACTAS) */}
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 md:p-1.5 hover:bg-white rounded-md transition-colors text-slate-600"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 md:p-1.5 hover:bg-white rounded-md transition-colors text-slate-600"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Subtotal visible solo en móviles debajo del título */}
                        <span className="sm:hidden text-xs font-bold text-slate-700">
                          Total: $
                          {(item.precio * item.cantidad).toLocaleString(
                            "es-CO",
                          )}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COLUMNA DERECHA: Resumen detallado del pedido (Ocupa 1 columna en lg) */}
            <div className="bg-white shadow-xl rounded-2xl md:rounded-3xl p-6 border border-slate-100 lg:sticky lg:top-28">
              <h3 className="font-black text-lg text-slate-800 mb-4 pb-2 border-b">
                Resumen de Compra
              </h3>

              {/* Desglose de precios */}
              <div className="space-y-3 text-sm font-medium text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal productos:</span>
                  <span className="text-slate-800">
                    ${total.toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Truck size={16} className="text-slate-400" /> Envío:
                  </span>
                  <span
                    className={
                      costoEnvio === 0
                        ? "text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md text-xs"
                        : "text-slate-800"
                    }
                  >
                    {costoEnvio === 0
                      ? "Gratis"
                      : `$${costoEnvio.toLocaleString("es-CO")}`}
                  </span>
                </div>
                {costoEnvio > 0 && (
                  <p className="text-[11px] text-orange-500 bg-orange-50 p-2 rounded-lg font-normal">
                    ¡Envío gratis por compras superiores a $150.000!
                  </p>
                )}
              </div>

              {/* NUEVO: Input visual para cupones (Conecta con tu lógica de TiendaCupondescuento en el futuro) */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  ¿Tienes un cupón?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Ticket
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      placeholder="Ej: EXPO2026"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors">
                    Aplicar
                  </button>
                </div>
              </div>

              {/* Total final */}
              <div className="pt-4 border-t-2 border-dashed border-slate-100 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold">
                    Total estimado:
                  </span>
                  <p className="text-2xl font-black text-slate-900">
                    <span className="text-orange-500 text-sm mr-0.5">$</span>
                    {(total + costoEnvio).toLocaleString("es-CO")}
                  </p>
                </div>
              </div>

              {/* Botones de navegación con tus mismas rutas (/ofertas y /checkout) */}
              <div className="flex flex-col gap-3">
                <Link
                  to="/checkout"
                  className="w-full text-center bg-orange-500 text-white font-black px-6 py-4 rounded-xl shadow-lg shadow-orange-200 text-sm md:text-base flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
                >
                  <CreditCard size={18} /> Finalizar Compra
                </Link>
                <Link
                  to="/ofertas"
                  className="w-full text-center bg-slate-100 text-slate-600 font-bold px-6 py-3 rounded-xl text-sm hover:bg-slate-200 transition-colors"
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
