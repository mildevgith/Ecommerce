import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Ticket,
  Trash2,
  Truck,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../axios"; // Tu instancia configurada de Axios
import { useCart } from "../context/CartContext";

export default function Carrito() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Estados reales para cupones y validación
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { codigo, descuento }
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponStatus, setCouponStatus] = useState({ type: "", text: "" });

  // Cálculo del subtotal base
  const subtotal = cart.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  // Regla de envío real para Cali (Gratis > $150.000, de lo contrario $8.000)
  const costoEnvio = subtotal >= 150000 || subtotal === 0 ? 0 : 8000;

  // Descuento real aplicado
  const descuentoMonto = appliedCoupon ? appliedCoupon.descuento : 0;

  // Total final real
  const totalFinal = Math.max(0, subtotal + costoEnvio - descuentoMonto);

  // Validación real de cupón con la base de datos de Django
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponStatus({ type: "", text: "" });

    try {
      const response = await api.post("/validar-cupon/", {
        codigo: couponCode,
        total: subtotal,
      });

      if (response.data.valido) {
        setAppliedCoupon({
          codigo: response.data.codigo,
          descuento: response.data.descuento,
        });
        setCouponStatus({ type: "success", text: response.data.mensaje });
      }
    } catch (error) {
      setAppliedCoupon(null);
      const errorMsg =
        error.response?.data?.error || "No se pudo validar el cupón.";
      setCouponStatus({ type: "error", text: errorMsg });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponStatus({ type: "", text: "" });
  };

  // Redirección real al proceso de pago pasando el estado final
  const handleProceedToCheckout = () => {
    navigate("/checkout", {
      state: {
        resumenPedido: {
          items: cart,
          subtotal,
          costoEnvio,
          cupon: appliedCoupon,
          descuento: descuentoMonto,
          total: totalFinal,
        },
      },
    });
  };

  return (
    <div className="pt-24 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 min-h-screen bg-slate-50/60 text-slate-900 selection:bg-orange-200">
      <div className="max-w-6xl mx-auto">

        {/* ENCABEZADO */}
        <div className="flex flex-col items-center mb-10 md:mb-14">
          <div className="bg-[#DE6E28]/15 p-4 rounded-2xl mb-3.5 border border-[#DE6E28]/30 shadow-xs">
            <ShoppingBag className="text-[#DE6E28] w-7 h-7 md:w-9 md:h-9" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#242A57] tracking-tight">Tu Carrito de Compras</h2>
          <p className="text-slate-500 text-sm md:text-base font-medium mt-1 text-center">
            Revisa tus productos y asegura la cadena de frío para tu hogar o negocio.
          </p>
        </div>

        {cart.length === 0 ? (
          /* ESTADO VACÍO */
          <div className="max-w-xl mx-auto text-center bg-white border border-slate-100 py-16 px-8 rounded-3xl shadow-xl shadow-slate-200/50">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag size={28} />
            </div>
            <h3 className="text-xl font-black text-[#242A57] mb-2">Tu carrito está vacío</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">
              Aún no has agregado productos del mar a tu pedido.
            </p>
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 bg-[#242A57] hover:bg-[#DE6E28] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg justify-center"
            >
              <ArrowLeft size={16} /> Ver Catálogo de Productos
            </Link>
          </div>
        ) : (
          /* GRID PRINCIPAL */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LISTA DE PRODUCTOS */}
            <div className="lg:col-span-7 bg-white shadow-xl shadow-slate-200/50 rounded-3xl p-6 md:p-8 border border-slate-100">
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
                  <span>Productos seleccionados</span>
                  <span className="bg-slate-100 text-[#242A57] text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {cart.reduce((acc, item) => acc + item.cantidad, 0)}
                  </span>
                </h3>
                <button
                  onClick={clearCart}
                  className="text-rose-500 text-xs font-bold flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl hover:bg-rose-100 transition-colors"
                >
                  <Trash2 size={14} /> Vaciar Carrito
                </button>
              </div>

              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-100 pb-6 last:border-0 last:pb-0"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-24 h-24 object-cover rounded-2xl shadow-sm border border-slate-100 shrink-0"
                    />

                    <div className="flex-1 w-full flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-black text-slate-800 text-base line-clamp-1">
                            {item.nombre}
                          </h4>
                          <p className="text-[#DE6E28] font-black text-sm mt-0.5">
                            ${item.precio?.toLocaleString("es-CO")}{" "}
                            <span className="text-slate-400 font-normal text-xs">
                              / Unid
                            </span>
                          </p>
                        </div>

                        <div className="text-right hidden sm:block">
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">
                            Subtotal
                          </span>
                          <p className="font-black text-[#242A57] text-base">
                            ${(item.precio * item.cantidad).toLocaleString("es-CO")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200/60">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600 shadow-2xs"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-black text-sm text-[#242A57]">
                            {item.cantidad}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600 shadow-2xs"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <span className="sm:hidden text-xs font-black text-[#242A57]">
                          Total: ${(item.precio * item.cantidad).toLocaleString("es-CO")}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RESUMEN Y CUPÓN REAL */}
            <div className="lg:col-span-5 bg-white shadow-xl shadow-slate-200/50 rounded-3xl p-6 md:p-8 border border-slate-100 lg:sticky lg:top-28">
              <h3 className="font-black text-xl text-[#242A57] mb-6 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>Resumen del Pedido</span>
                <Sparkles size={18} className="text-[#DE6E28]" />
              </h3>

              <div className="space-y-4 text-sm font-medium text-slate-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal productos:</span>
                  <span className="text-slate-800 font-bold">${subtotal.toLocaleString("es-CO")}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <Truck size={16} className="text-[#DE6E28]" /> Envío en Cali:
                  </span>
                  <span
                    className={
                      costoEnvio === 0
                        ? "text-emerald-600 font-black bg-emerald-50 px-2.5 py-1 rounded-lg text-xs border border-emerald-100"
                        : "text-slate-800 font-bold"
                    }
                  >
                    {costoEnvio === 0 ? "¡Gratis!" : `$${costoEnvio.toLocaleString("es-CO")}`}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-600 font-bold bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100">
                    <span className="flex items-center gap-1 text-xs">
                      <Ticket size={15} /> Cupón ({appliedCoupon.codigo}):
                    </span>
                    <span>-${descuentoMonto.toLocaleString("es-CO")}</span>
                  </div>
                )}

                {subtotal < 150000 && (
                  <p className="text-xs text-orange-600 bg-orange-50 p-3 rounded-2xl font-medium border border-orange-100 leading-relaxed">
                    💡 ¡Agrega <strong>${(150000 - subtotal).toLocaleString("es-CO")}</strong> más en productos para obtener <strong>envío gratis</strong>!
                  </p>
                )}
              </div>

              {/* FORMULARIO REAL DE CUPÓN CONECTADO A DJANGO */}
              <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                  ¿Tienes un cupón de descuento?
                </label>

                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Ticket
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder="Ej: EXPO2026"
                          disabled={couponLoading}
                          className="w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-[#DE6E28] transition-colors"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={couponLoading || !couponCode.trim()}
                        className="bg-[#242A57] hover:bg-[#DE6E28] text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
                      >
                        {couponLoading ? <Loader2 size={16} className="animate-spin" /> : "Aplicar"}
                      </button>
                    </div>

                    {couponStatus.text && (
                      <div className={`flex items-center gap-1.5 text-xs font-semibold mt-2 ${
                        couponStatus.type === "success" ? "text-emerald-600" : "text-rose-500"
                      }`}>
                        {couponStatus.type === "success" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        <span>{couponStatus.text}</span>
                      </div>
                    )}
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-100/60 border border-emerald-300/50 p-2.5 rounded-xl">
                    <span className="text-xs font-bold text-emerald-800">
                      Cupón <strong>{appliedCoupon.codigo}</strong> aplicado
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-rose-600 hover:text-rose-800 text-xs font-bold underline"
                    >
                      Quitar
                    </button>
                  </div>
                )}
              </div>

              {/* TOTAL FINAL REAL */}
              <div className="pt-4 border-t-2 border-dashed border-slate-100 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-black text-sm uppercase tracking-wider">
                    Total a Pagar:
                  </span>
                  <p className="text-3xl font-black text-[#242A57]">
                    <span className="text-[#DE6E28] text-lg mr-0.5">$</span>
                    {totalFinal.toLocaleString("es-CO")}
                  </p>
                </div>
              </div>

              {/* BOTÓN REAL PARA FINALIZAR COMPRA */}
              <div className="flex flex-col gap-3.5">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full text-center bg-[#DE6E28] hover:bg-[#c55d1f] text-white font-black px-6 py-4 rounded-2xl shadow-lg shadow-orange-500/25 text-sm flex items-center justify-center gap-2.5 transition-all transform hover:scale-[1.01]"
                >
                  <CreditCard size={18} /> Proceder al Pago Seguro
                </button>
                <Link
                  to="/productos"
                  className="w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-colors"
                >
                  Seguir Comprando
                </Link>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
