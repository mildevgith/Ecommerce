import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Switch entre Login y Registro
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Definimos a qué URL pegarle según el modo
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
        // ¡REAL! Guardamos la sesión en el navegador
        localStorage.setItem("user", JSON.stringify(data.user));
        alert(isLogin ? "Bienvenido de nuevo" : "Cuenta creada con éxito");
        navigate("/"); // Al inicio o al dashboard
        window.location.reload(); // Para refrescar el Navbar con el nombre real
      } else {
        alert(data.error || "Algo salió mal");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg border-t-4 border-[#242a57]">
      <h2 className="text-2xl font-bold text-center text-[#242a57] mb-6">
        {isLogin ? "INGRESAR" : "CREAR CUENTA"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            required
          />
        )}
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />

        <button
          disabled={loading}
          className="w-full bg-[#242a57] text-white p-3 rounded-lg font-bold hover:bg-[#1a1f40]"
        >
          {loading ? "Procesando..." : (isLogin ? "Entrar" : "Registrarse")}
        </button>
      </form>

      <p className="text-center mt-4 text-sm">
        {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-[#de6e28] font-bold underline"
        >
          {isLogin ? "Regístrate aquí" : "Inicia sesión"}
        </button>
      </p>
    </div>
  );
}
