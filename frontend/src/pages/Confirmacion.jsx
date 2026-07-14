import { motion } from "framer-motion"; // Animaciones de entrada
import { CheckCircle, Home, Printer, AlertTriangle } from "lucide-react"; // Iconos UI
import { Link, useLocation } from "react-router-dom"; // Navegación

export default function Confirmation() {
  const location = useLocation();
  // Capturamos el objeto del pedido enviado desde el componente Checkout (via navigate state)
  const pedido = location.state?.pedido;

  // VALIDACIÓN DE SEGURIDAD: 
  // Si el usuario refresca la página o entra directo, no habrá 'pedido'. 
  // Mostramos una alerta en lugar de romper el componente al intentar leer propiedades nulas.
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

  // Desestructuración de datos provenientes del backend (Django)
  const { id, numero_pedido, fecha_creacion, datos_envio, items, total } = pedido;

  // CÁLCULOS MATEMÁTICOS (basados en los datos recibidos):
  const totalPagado = parseFloat(total || 0);
  // Re-calculamos el subtotal real para mostrar el desglose limpio en la factura
  const subtotalReal = items ? items.reduce((acc, item) => acc + (parseFloat(item.precio_unitario) * item.cantidad), 0) : 0;
  const envioReal = totalPagado - subtotalReal; // Diferencia para obtener el costo de envío aplicado

  // Función para abrir el diálogo de impresión del navegador
  const handlePrint = () => {
    window.print(); 
  };

  return (
    <div className="pt-24 pb-16 bg-slate-50 min-h-screen text-slate-900">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* SECCIÓN 1: MENSAJE DE ÉXITO (print:hidden asegura que esto NO salga en el PDF) */}
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

          {/* Botones de acción */}
          <div className="flex justify-center gap-4 mt-6">
            <button onClick={handlePrint} className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-md text-sm cursor-pointer">
              <Printer size={18} /> Visualizar / Descargar PDF
            </button>
            <Link to="/" className="bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-300 transition-all flex items-center gap-2 text-sm">
              <Home size={18} /> Ir al Inicio
            </Link>
          </div>
        </div>

        {/* SECCIÓN 2: FACTURA (Diseño responsivo y adaptado para impresión) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 rounded-3xl border border-slate-200/80 shadow-xl print:shadow-none print:border-none print:p-0"
        >
          {/* Encabezado: Nombre empresa y número de factura */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8">
            <div>
              <h1 className="text-2xl font-black text-[#1a1f3c] tracking-tight">EXPOMAR GRUPO GRB</h1>
              <p className="text-xs text-slate-400 mt-1">NIT: 900.123.456-1 | Cali, Valle del Cauca</p>
            </div>
            <div className="sm:text-right">
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black uppercase inline-block mb-2 print:border">Factura de Venta</span>
              <h3 className="text-lg font-black text-slate-800">FAC-{numero_pedido || id}</h3>
              <p className="text-xs text-slate-400 mt-1">Fecha Emisión: {fecha_creacion ? new Date(fecha_creacion).toLocaleDateString("es-CO") : new Date().toLocaleDateString("es-CO")}</p>
            </div>
          </div>

          {/* Datos de contacto y envío */}
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
            </div>
          </div>

          {/* Tabla de artículos */}
          <div className="py-8">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                  <th className="pb-3">Producto</th>
                  <th className="pb-3 text-center">Cant.</th>
                  <th className="pb-3 text-right">Unitario</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {items?.map((item, index) => (
                  <tr key={item.id || index}>
                    <td className="py-4 font-medium text-slate-800">{item.producto_nombre}</td>
                    <td className="py-4 text-center">{item.cantidad}</td>
                    <td className="py-4 text-right">${parseFloat(item.precio_unitario).toLocaleString("es-CO")}</td>
                    <td className="py-4 text-right font-bold text-slate-900">${(parseFloat(item.precio_unitario) * item.cantidad).toLocaleString("es-CO")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totales finales */}
          <div className="border-t border-slate-200 pt-6 flex justify-end">
            <div className="w-full sm:w-64 space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>${subtotalReal.toLocaleString("es-CO")}</span></div>
              <div className="flex justify-between"><span>Envío</span><span>{envioReal <= 0 ? "Gratis" : `$${envioReal.toLocaleString("es-CO")}`}</span></div>
              <div className="border-t pt-3 flex justify-between font-bold text-base"><span>Total Pagado</span><span>${totalPagado.toLocaleString("es-CO")} COP</span></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}