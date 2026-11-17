import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ecommerce-dsr6.onrender.com";

export default function RecuperarPassword() {
  const [paso, setPaso] = useState(1); // 1: pedir correo | 2: ingresar código y nueva clave
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMensaje("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password-reset/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (response.ok) {
        setMensaje(data.message);
        setPaso(2);
      } else {
        setError(data.error || "Error al procesar la solicitud.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmarCambio = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/password-reset/confirm/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          codigo,
          nueva_password: nuevaPassword,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate("/auth");
      } else {
        setError(data.error || "No se pudo cambiar la contraseña.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border-t-8 border-[#de6e28]">
        <h2 className="text-2xl font-extrabold text-center text-[#242a57] mb-2">
          RECUPERAR CONTRASEÑA
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          {paso === 1
            ? "Ingresa tu correo registrado y te enviaremos un código de verificación."
            : `Ingresa el código de 6 dígitos enviado a ${email}`}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-700 text-sm font-medium border border-green-200">
            {mensaje}
          </div>
        )}

        {paso === 1 ? (
          <form onSubmit={handleSolicitarCodigo} autoComplete="off" className="space-y-5">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1f3c] text-white py-4 rounded-xl font-bold hover:bg-[#242a57] transition-all disabled:opacity-60"
            >
              {loading ? "Enviando código..." : "Enviar código al correo"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmarCambio} autoComplete="off" className="space-y-5">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Código de 6 dígitos"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
              required
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl text-center tracking-widest text-xl font-bold outline-none focus:ring-2 focus:ring-[#0bafd4]"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nueva contraseña (mín. 8 caracteres)"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-[#242a57] font-medium"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1f3c] text-white py-4 rounded-xl font-bold hover:bg-[#242a57] transition-all disabled:opacity-60"
            >
              {loading ? "Actualizando..." : "Guardar nueva contraseña"}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="text-sm text-[#de6e28] font-bold hover:underline"
          >
            Volver a Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
