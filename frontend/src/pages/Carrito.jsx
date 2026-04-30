import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft, CreditCard, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Carrito() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="pt-20 pb-10 md:pt-28 md:pb-20 px-4 min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto">

        {/* Encabezado adaptable */}
        <div className="flex flex-col items-center mb-8 md:mb-12">
          <div className="bg-orange-500/10 p-3 rounded-full mb-3">
            <ShoppingBag className="text-orange-600 w-6 h-6 md:w-8 md:h-8" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black">Tu Carrito</h2>
          <p className="text-slate-500 text-sm md:text-base">Revisa tus productos antes de pagar</p>
        </div>

        {cart.length === 0 ? (
          <div className="text-center bg-white border py-12 px-6 rounded-3xl shadow-sm">
            <p className="text-lg text-slate-600 mb-6 font-medium">Tu carrito está vacío.</p>
            <Link to="/productos" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold w-full sm:w-auto justify-center">
              <ArrowLeft size={18} /> Explorar Tienda
            </Link>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl md:rounded-3xl p-4 md:p-8 border border-slate-100">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="font-bold text-slate-700">Items ({cart.length})</h3>
              <button onClick={clearCart} className="text-red-500 text-xs font-bold flex items-center gap-1 bg-red-50 px-2 py-1 rounded-lg">
                <Trash2 size={14} /> Vaciar
              </button>
            </div>

            {/* LISTA DE PRODUCTOS OPTIMIZADA PARA MÓVIL */}
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex flex-row items-start gap-3 md:gap-6 border-b border-slate-50 pb-6 last:border-0">
                  {/* Imagen pequeña en móvil, normal en PC */}
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-sm"
                  />

                  <div className="flex-1 flex flex-col justify-between h-20 md:h-24">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm md:text-lg line-clamp-1">{item.nombre}</h4>
                      <p className="text-orange-600 font-black text-xs md:text-sm">
                        ${item.precio?.toLocaleString("es-CO")}
                      </p>
                    </div>

                    {/* Controles de cantidad y eliminar */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 md:p-1.5 hover:bg-white rounded-md transition-colors text-slate-600"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 md:p-1.5 hover:bg-white rounded-md transition-colors text-slate-600"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

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

            {/* RESUMEN DE PAGO ADAPTABLE */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-400 font-bold">Total:</span>
                <p className="text-2xl md:text-3xl font-black text-slate-900">
                  <span className="text-orange-500 text-lg mr-1">$</span>
                  {total.toLocaleString("es-CO")}
                </p>
              </div>

              {/* Botones apilados en móvil, uno al lado del otro en PC */}
              <div className="flex flex-col md:flex-row justify-end gap-3">
                <Link
                  to="/productos"
                  className="order-2 md:order-1 text-center bg-slate-100 text-slate-600 font-bold px-6 py-4 rounded-xl text-sm md:text-base"
                >
                  Seguir comprando
                </Link>
                <Link
                  to="/checkout"
                  className="order-1 md:order-2 text-center bg-orange-500 text-white font-black px-6 py-4 rounded-xl shadow-lg shadow-orange-200 text-sm md:text-base flex items-center justify-center gap-2"
                >
                  <CreditCard size={18} /> Finalizar Compra
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
