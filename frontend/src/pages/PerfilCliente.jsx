// src/pages/PerfilCliente.jsx
import { useState } from "react";

export default function PerfilCliente() {
  const [cliente] = useState({
    nombre: "Juan Pérez",
    email: "juanperez@example.com",
    direccion: "Cartagena, Colombia",
  });

  const [pedidos] = useState([
    {
      id: 1,
      fecha: "2025-11-08",
      total: 87000,
      estado: "Entregado",
    },
    {
      id: 2,
      fecha: "2025-10-28",
      total: 42000,
      estado: "En camino",
    },
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Mi cuenta
      </h2>

      {/* Información del cliente */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold text-blue-700 mb-3">
          Información personal
        </h3>
        <p><strong>Nombre:</strong> {cliente.nombre}</p>
        <p><strong>Correo:</strong> {cliente.email}</p>
        <p><strong>Dirección:</strong> {cliente.direccion}</p>
      </div>

      {/* Pedidos */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-3">
          Mis pedidos
        </h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-50 text-blue-700 font-semibold">
              <th className="py-2 px-4 border-b"># Pedido</th>
              <th className="py-2 px-4 border-b">Fecha</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Estado</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{pedido.id}</td>
                <td className="py-2 px-4 border-b">{pedido.fecha}</td>
                <td className="py-2 px-4 border-b">
                  ${pedido.total.toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">{pedido.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
