// src/pages/AuthPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  // Estado para alternar entre los modos de Inicio de Sesión y Registro
  const [isLogin, setIsLogin] = useState(true); 
  
  // Estado del objeto que almacenará los datos de los inputs
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" });
  
  // Estado para bloquear el botón de envío durante la petición al servidor
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Definimos el endpoint de Django según el modo activo
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
        // Al tener éxito, guardamos los datos del usuario en localStorage
        // Esto permite que la app 'recuerde' quién está conectado tras refrescar
        localStorage.setItem("user", JSON.stringify(data.user));
        
        alert(isLogin ? "Bienvenido de nuevo" : "Cuenta creada con éxito");
        
        // Redirigimos al Home o Dashboard
        navigate("/"); 
        
        // Recarga forzada para que el componente Navbar detecte el cambio en localStorage
        window.location.reload(); 
      } else {
        // Mostramos el mensaje de error enviado desde el backend (Django)
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
      {/* Título dinámico según el modo actual */}
      <h2 className="text-2xl font-bold text-center text-[#242a57] mb-6">
        {isLogin ? "INGRESAR" : "CREAR CUENTA"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo opcional: solo aparece si estamos en modo registro */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Nombre completo"
            className="w-full p-3 border rounded-lg"
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            required
          />
        )}
        
        {/* Campos comunes para login y registro */}
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

        {/* Botón de acción con estado de carga (disabled durante petición) */}
        <button
          disabled={loading}
          className="w-full bg-[#242a57] text-white p-3 rounded-lg font-bold hover:bg-[#1a1f40] transition-colors"
        >
          {loading ? "Procesando..." : (isLogin ? "Entrar" : "Registrarse")}
        </button>
      </form>

      {/* Botón de alternancia entre Login y Registro */}
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