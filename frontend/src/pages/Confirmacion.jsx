import { motion } from "framer-motion";
import { CheckCircle, Home, Printer, AlertTriangle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Confirmation() {
  const location = useLocation();
  // Capturamos el pedido real enviado desde el estado de la navegación
  const pedido = location.state?.pedido;

  // Si el usuario ingresa de forma directa sin datos del pedido, evitamos el quiebre de la app
  if (!pedido) {
    return (
      <div className="pt-32 pb-16 bg-slate-50 min-h-screen flex items-center justify-center text-slate-900">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm">
          <AlertTriangle className="mx-auto text-amber-500 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-800">No se encontró información del pedido</h3>
          <p className="text-sm text-slate-500 mt-2 mb-6">
            Parece que intentaste acceder al comprobante directamente o la sesión de compra expiró.
          </p>
          <Link to="/" className="inline-block bg-[#1a1f3c] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  // Desestructuramos los campos del JSON real devuelto por tu servidor Django
  const { id, numero_pedido, fecha_creacion, datos_envio, items, total } = pedido;

  const totalPagado = parseFloat(total || 0);
  // Calculamos los subtotales basados estrictamente en los items del backend
  const subtotalReal = items ? items.reduce((acc, item) => acc + (parseFloat(item.precio_unitario) * item.cantidad), 0) : 0;
  const envioReal = totalPagado - subtotalReal;

  const handlePrint = () => {
    window.print(); // Ejecuta el proceso del navegador para imprimir o Guardar como PDF de forma limpia
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* SECCIÓN 1: MENSAJE DE ÉXITO (Se oculta por completo al generar el PDF gracias a print:hidden) */}
        <div className="print:hidden text-center mb-8">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex bg-emerald-100 text-emerald-600 p-4 rounded-full mb-4"
          >
            <CheckCircle size={48} />
          </motion.div>
          <h2 className="text-3xl font-black text-[#1a1f3c]">¡Tu pedido ha sido confirmado!</h2>
          <p className="text-slate-500 mt-2">
            Hemos registrado tu compra con éxito. A continuación puedes visualizar tu comprobante oficial.
          </p>

          {/* Acciones Rápidas */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={handlePrint}
              type="button"
              className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-md shadow-orange-500/10 text-sm cursor-pointer"
            >
              <Printer size={18} /> Visualizar / Descargar PDF
            </button>
            <Link
              to="/"
              className="bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center gap-2 text-sm"
            >
              <Home size={18} /> Ir al Inicio
            </Link>
          </div>
        </div>

        {/* SECCIÓN 2: LA FACTURA (Diseño optimizado para Pantalla e Impresión) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-100/50 relative overflow-hidden print:shadow-none print:border-none print:p-0"
        >
          {/* Adorno estético de factura (Oculto al imprimir) */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-[#1a1f3c] print:hidden"></div>

          {/* Encabezado de la Factura */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8">
            <div>
              <h1 className="text-2xl font-black text-[#1a1f3c] tracking-tight">EXPOMAR GRUPO GRB</h1>
              <p className="text-xs text-slate-400 mt-1">NIT: 900.123.456-1</p>
              <p className="text-xs text-slate-400">Cali, Valle del Cauca - Colombia</p>
            </div>
            <div className="sm:text-right">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider inline-block mb-2 print:border print:border-orange-500 print:text-orange-600">
                Factura de Venta
              </span>
              <h3 className="text-lg font-black text-slate-800">FAC-{numero_pedido || id}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Fecha Emisión: {fecha_creacion ? new Date(fecha_creacion).toLocaleDateString("es-CO") : new Date().toLocaleDateString("es-CO")}
              </p>
            </div>
          </div>

          {/* Detalles de Facturación y Envío reales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b border-slate-100 text-sm">
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-2">Facturado a:</h4>
              <p className="font-bold text-slate-800">{datos_envio?.nombre}</p>
              <p className="text-slate-500">{datos_envio?.email}</p>
              <p className="text-slate-500">Tel: {datos_envio?.telefono}</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-400 uppercase text-[10px] tracking-wider mb-2">Dirección de Entrega:</h4>
              <p className="text-slate-700">{datos_envio?.direccion}</p>
              <p className="text-slate-700">{datos_envio?.ciudad}, {datos_envio?.departamento}</p>
              <p className="text-slate-500 mt-1">
                <span className="font-medium text-slate-800">Método de pago: </span> 
                {datos_envio?.metodoPago === 'efectivo' ? 'Pago Contra Entrega' : datos_envio?.metodoPago === 'pse' ? 'PSE / Transferencia' : 'Tarjeta de Crédito'}
              </p>
            </div>
          </div>

          {/* Tabla de Artículos Reales */}
          <div className="py-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Descripción del Producto</th>
                  <th className="pb-3 text-center">Cant.</th>
                  <th className="pb-3 text-right">Precio Unitario</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {items?.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="py-4 font-medium text-slate-800">
                      {item.producto_nombre || `Producto (ID: ${item.producto_id})`}
                    </td>
                    <td className="py-4 text-center">{item.cantidad}</td>
                    <td className="py-4 text-right">${parseFloat(item.precio_unitario).toLocaleString("es-CO")}</td>
                    <td className="py-4 text-right font-bold text-slate-900">
                      ${(parseFloat(item.precio_unitario) * item.cantidad).toLocaleString("es-CO")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales Matemáticos Reales */}
          <div className="border-t border-slate-200 pt-6 flex justify-end">
            <div className="w-full sm:w-64 space-y-3 text-sm text-slate-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">${subtotalReal.toLocaleString("es-CO")}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Costo de Envío</span>
                <span className="font-medium text-slate-800">
                  {envioReal <= 0 ? "Gratis" : `$${envioReal.toLocaleString("es-CO")}`}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between items-end">
                <span className="font-bold text-slate-800 text-base">Total Pagado</span>
                <span className="text-xl font-black text-slate-900">${totalPagado.toLocaleString("es-CO")} COP</span>
              </div>
            </div>
          </div>

          {/* Pie de página legal */}
          <div className="mt-12 text-center text-[11px] text-slate-400 border-t border-slate-100 pt-6">
            <p>Esta es una representación gráfica digital de la transacción.</p>
            <p className="mt-1 font-medium text-slate-500">¡Gracias por tu compra en Expomar!</p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}