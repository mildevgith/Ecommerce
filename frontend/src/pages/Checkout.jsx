import { motion } from "framer-motion";
import {
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    metodoPago: "tarjeta", // Este estado controla dinámicamente los botones y las vistas de pago
  });

  // Estados locales extras para los datos específicos de la tarjeta de crédito
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: "",
    vencimiento: "",
    cvv: "",
  });

  // Estado local para el banco seleccionado en PSE
  const [bancoPse, setBancoPse] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleTarjetaChange = (e) =>
    setDatosTarjeta({ ...datosTarjeta, [e.target.name]: e.target.value });

  const subtotal = cart.reduce(
    (acc, item) => acc + (item.precio_oferta || item.precio) * item.cantidad,
    0,
  );
  const envio = subtotal > 150000 ? 0 : 12000; 
  const total = subtotal + envio;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Tu carrito está vacío");
    
    // Validación manual rápida antes de enviar al backend según el pago elegido
    if (form.metodoPago === "pse" && !bancoPse) {
      return alert("Por favor, selecciona tu banco para continuar con la transacción PSE.");
    }

    setLoading(true);

    const pedidoData = {
      datos_envio: form,
      items: cart.map((item) => ({
        producto_id: item.id,
        producto_nombre: item.nombre, // Pasamos el nombre para que la factura lo use directamente
        cantidad: item.cantidad,
        precio_unitario: item.precio_oferta || item.precio,
      })),
      total: total,
    };

    try {
      const response = await fetch("http://localhost:8000/api/pedidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoData),
      });

      if (response.ok) {
        const pedidoCreado = await response.json(); // <--- Capturamos los datos reales generados por Django
        clearCart();
        // Redirigimos pasando el objeto real del pedido en el estado de la navegación
        navigate("/confirmacion", { state: { pedido: pedidoCreado } });
      } else {
        const err = await response.json();
        alert("Error: " + (err.error || "No se pudo procesar el pedido"));
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-6xl mx-auto px-4">
        {/* Enlace de regreso */}
        <Link
          to="/carrito"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-500 transition-colors mb-6"
        >
          <ChevronLeft size={16} /> Volver al carrito
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* COLUMNA IZQUIERDA: FORMULARIOS (7 columnas en PC) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sección 1: Datos de Envío */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-500/10 p-2 rounded-lg text-orange-600">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1f3c]">
                    Información de Envío
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Nombre Completo
                    </label>
                    <input
                      name="nombre"
                      type="text"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      name="email"
                      type="email"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      name="telefono"
                      type="tel"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Dirección de Entrega
                    </label>
                    <input
                      name="direccion"
                      type="text"
                      placeholder="Calle, apartamento, bloque..."
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Ciudad
                    </label>
                    <input
                      name="ciudad"
                      type="text"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                      Departamento
                    </label>
                    <input
                      name="departamento"
                      type="text"
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Métodos de Pago Profesionales e Interactivos */}
              <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#1a1f3c]/10 p-2 rounded-lg text-[#1a1f3c]">
                    <CreditCard size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1a1f3c]">
                    Método de Pago
                  </h3>
                </div>

                {/* Fila de Botones de Opción */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Tarjeta */}
                  <label
                    className={`border rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      form.metodoPago === "tarjeta"
                        ? "border-orange-500 bg-orange-500/5 text-orange-600 font-bold shadow-sm"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value="tarjeta"
                      checked={form.metodoPago === "tarjeta"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <CreditCard size={24} />
                    <span className="text-xs">Tarjeta de Crédito</span>
                  </label>

                  {/* PSE / Transferencia */}
                  <label
                    className={`border rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      form.metodoPago === "pse"
                        ? "border-orange-500 bg-orange-500/5 text-orange-600 font-bold shadow-sm"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value="pse"
                      checked={form.metodoPago === "pse"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Wallet size={24} />
                    <span className="text-xs">PSE / Transferencia</span>
                  </label>

                  {/* Contra Entrega */}
                  <label
                    className={`border rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      form.metodoPago === "efectivo"
                        ? "border-orange-500 bg-orange-500/5 text-orange-600 font-bold shadow-sm"
                        : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value="efectivo"
                      checked={form.metodoPago === "efectivo"}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Truck size={24} />
                    <span className="text-xs">Pago Contra Entrega</span>
                  </label>
                </div>

                {/* Subformulario Condicional Dinámico */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60">
                  {form.metodoPago === "tarjeta" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3"
                    >
                      <h4 className="text-sm font-bold text-slate-700 mb-1">Datos de tu Tarjeta de Crédito</h4>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Número de Tarjeta</label>
                        <input
                          type="text"
                          name="numero"
                          value={datosTarjeta.numero}
                          onChange={handleTarjetaChange}
                          placeholder="4557 •••• •••• ••••"
                          maxLength="16"
                          required={form.metodoPago === "tarjeta"}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Vencimiento</label>
                          <input
                            type="text"
                            name="vencimiento"
                            value={datosTarjeta.vencimiento}
                            onChange={handleTarjetaChange}
                            placeholder="MM/AA"
                            maxLength="5"
                            required={form.metodoPago === "tarjeta"}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm text-center"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">CVC / CVV</label>
                          <input
                            type="password"
                            name="cvv"
                            value={datosTarjeta.cvv}
                            onChange={handleTarjetaChange}
                            placeholder="•••"
                            maxLength="3"
                            required={form.metodoPago === "tarjeta"}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm text-center"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {form.metodoPago === "pse" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <h4 className="text-sm font-bold text-slate-700">Pago Seguro vía PSE</h4>
                      <p className="text-xs text-slate-400 mb-2">Serás redirigido a la plataforma oficial de tu entidad financiera al procesar la orden.</p>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Selecciona tu Banco</label>
                      <select 
                        value={bancoPse}
                        onChange={(e) => setBancoPse(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm"
                      >
                        <option value="">-- Elige un banco --</option>
                        <option value="bancolombia">Bancolombia</option>
                        <option value="nequi">Nequi</option>
                        <option value="daviplata">Daviplata</option>
                        <option value="bogota">Banco de Bogotá</option>
                      </select>
                    </motion.div>
                  )}

                  {form.metodoPago === "efectivo" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 text-amber-800"
                    >
                      <span className="text-2xl mt-0.5">📦</span>
                      <div>
                        <h4 className="text-sm font-bold text-amber-900">¡Pagas cuando recibas en casa!</h4>
                        <p className="text-xs text-amber-700/90 leading-relaxed mt-0.5">
                          No tienes que ingresar credenciales bancarias. Recuerda tener listo el dinero en efectivo para cancelarle directamente a la transportadora cuando entreguen tus productos.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Mensaje de Transacción Secura */}
                <div className="mt-6 flex items-center gap-2 bg-emerald-50 text-emerald-700 p-3 rounded-xl text-xs font-medium">
                  <ShieldCheck size={16} className="shrink-0" />
                  <span>
                    Tus datos y transacciones están cifrados de extremo a
                    extremo de forma segura.
                  </span>
                </div>
              </div>

              {/* Botón de Envío Dinámico */}
              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-[#1a1f3c] text-white p-4 rounded-xl font-black hover:bg-[#242a57] active:scale-[0.99] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-50 text-base cursor-pointer"
              >
                {loading
                  ? "Procesando Pedido..."
                  : form.metodoPago === "efectivo"
                    ? "Confirmar y Finalizar Pedido"
                    : `Confirmar y Pagar $${total.toLocaleString("es-CO")}`}
              </button>
            </form>
          </motion.div>

          {/* COLUMNA DERECHA: RESUMEN DE COMPRA (5 columnas en PC) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 border-b pb-4 mb-4">
                <ShoppingBag size={18} className="text-slate-400" />
                <h3 className="font-bold text-slate-700">
                  Resumen del Pedido ({cart.length})
                </h3>
              </div>

              {/* Contenedor de Items */}
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 pr-2">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <img
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-14 h-14 object-cover rounded-lg bg-slate-50 border border-slate-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 truncate">
                        {item.nombre}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Cant: {item.cantidad}
                      </p>
                    </div>
                    <span className="text-sm font-black text-slate-900 shrink-0">
                      $
                      {(
                        (item.precio_oferta || item.precio) * item.cantidad
                      ).toLocaleString("es-CO")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desgloses Matemáticos */}
              <div className="border-t pt-4 mt-4 space-y-2 text-sm text-slate-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">
                    ${subtotal.toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Costo de Envío</span>
                  <span
                    className={`font-medium ${envio === 0 ? "text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs font-bold" : "text-slate-800"}`}
                  >
                    {envio === 0
                      ? "Gratis"
                      : `$${envio.toLocaleString("es-CO")}`}
                  </span>
                </div>

                <div className="border-t-2 border-dashed pt-4 mt-2 flex justify-between items-end">
                  <span className="font-bold text-slate-700 text-base">
                    Total a Pagar
                  </span>
                  <span className="text-2xl font-black text-slate-900 flex items-start leading-none">
                    <span className="text-orange-500 text-sm font-bold mt-0.5 mr-0.5">
                      $
                    </span>
                    {total.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}