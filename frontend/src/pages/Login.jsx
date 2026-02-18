// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redirigir
import { useAuth } from "../Hooks/useAuth"; // Para el estado global

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth(); // Extraemos la función profesional de login
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // LLAMADA REAL AL BACKEND
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Guardamos en el contexto (esto actualiza el Navbar al instante)
        // data debe traer: { user: {email, nombre...}, token: "jwt-string" }
        login(data.user, data.token);

        // 2. Redirección inmediata a Ofertas
        navigate("/ofertas");
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      // Ahora usamos 'err' para ver el mensaje real en la consola
      console.error("Error detallado:", err);
      setError("Error de conexión con el servidor. Revisa si el backend está encendido.");
    }
  };





  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-6 pt-20">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Iniciar sesión
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">Correo electrónico</label>
            <input
              type="email"
              name="email"
              placeholder="ejemplo@correo.com"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 text-gray-700">Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-600 outline-none disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3 rounded-lg transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          ¿No tienes cuenta?{" "}
          <button
            onClick={() => navigate("/registro")}
            className="text-blue-600 hover:underline font-medium"
          >
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
}
