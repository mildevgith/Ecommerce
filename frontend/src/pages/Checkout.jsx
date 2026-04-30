import { motion } from "framer-motion";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "", email: "", telefono: "", direccion: "",
    ciudad: "", departamento: "", metodoPago: "tarjeta"
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Carrito vacío");
    setLoading(true);

    const pedidoData = {
      datos_envio: form,
      items: cart.map(item => ({
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_oferta || item.precio
      })),
      total: cart.reduce((acc, item) => acc + (item.precio_oferta || item.precio) * item.cantidad, 0)
    };

    try {
      const response = await fetch("http://localhost:8000/api/pedidos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedidoData),
      });

      if (response.ok) {
        clearCart();
        navigate("/confirmacion");
      } else {
        const err = await response.json();
        alert("Error: " + err.error);
      }
    } catch (error) {
      alert("Error de conexión");
    } finally { setLoading(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Finalizar Compra</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-xl shadow-lg">
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required className="w-full border p-2 rounded"/>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="w-full border p-2 rounded"/>
        <input name="direccion" placeholder="Dirección" onChange={handleChange} required className="w-full border p-2 rounded"/>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold">
          {loading ? "Procesando..." : "Confirmar Pedido"}
        </button>
      </form>
    </motion.div>
  );
}
