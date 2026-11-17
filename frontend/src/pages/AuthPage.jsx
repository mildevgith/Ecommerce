import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Usa tu variable de entorno de Vercel o la URL de Render por defecto
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ecommerce-dsr6.onrender.com";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ nombre: "", email: "", password: "" }); // Limpia los campos al cambiar entre Login y Registro
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin
      ? `${API_BASE_URL}/api/auth/login/`
      : `${API_BASE_URL}/api/auth/register/`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", "session_activa");
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/checkout", { replace: true });
        window.location.reload();
      } else {
        alert(data.error || "Error en la autenticación");
      }
    } catch (error) {
      alert("No se pudo conectar con el servidor. Si es la primera carga, espera unos segundos e intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border-t-8 border-[#de6e28]">
        <h2 className="text-3xl font-extrabold text-center text-[#242a57] mb-6">
          {isLogin ? "INGRESAR" : "REGISTRARSE"}
        </h2>

        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          {!isLogin && (
            <input
              name="nombre"
              type="text"
              placeholder="Nombre completo"
              value={formData.nombre}
              autoComplete="off"
              required
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
              onChange={handleChange}
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            value={formData.email}
            autoComplete="off"
            required
            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
            onChange={handleChange}
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={formData.password}
              autoComplete="new-password"
              required
              className="w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 hover:text-[#242a57] font-medium"
            >
              {showPassword ? "Ocultar" : "Ver"}
            </button>
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/recuperar-password")}
                className="text-sm text-gray-500 hover:text-[#de6e28] transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1f3c] text-white py-4 rounded-xl font-bold hover:bg-[#242a57] transition-all disabled:opacity-60"
          >
            {loading ? "Procesando..." : isLogin ? "Entrar" : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button onClick={toggleMode} className="text-[#de6e28] font-bold hover:underline">
            {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
