import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin
      ? "http://localhost:8000/api/auth/login/"
      : "http://localhost:8000/api/auth/register/";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Guardamos los datos reales
        localStorage.setItem("token", "session_activa");
        localStorage.setItem("user", JSON.stringify(data.user));

        // 2. Forzamos la redirección al inicio o al checkout si venía de allá
        navigate("/checkout", { replace: true });

        // 3. RECARGA NECESARIA: Para que el Navbar lea el nuevo localStorage
        window.location.reload();
      } else {
        alert(data.error || "Error en la autenticación");
      }
    } catch (error) {
      alert("Error de conexión con el servidor Django");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border-t-8 border-[#de6e28]">
        <h2 className="text-3xl font-extrabold text-center text-[#242a57] mb-2">
          {isLogin ? "INGRESAR" : "REGISTRARSE"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <input name="nombre" type="text" placeholder="Nombre completo" required
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
              onChange={handleChange} />
          )}
          <input name="email" type="email" placeholder="Correo electrónico" required
            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
            onChange={handleChange} />
          <input name="password" type="password" placeholder="Contraseña" required
            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
            onChange={handleChange} />
          <button type="submit" disabled={loading}
            className="w-full bg-[#1a1f3c] text-white py-4 rounded-xl font-bold hover:bg-[#242a57] transition-all">
            {loading ? "Procesando..." : (isLogin ? "Entrar" : "Crear Cuenta")}
          </button>
        </form>
        <div className="mt-8 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#de6e28] font-bold hover:underline">
            {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}
