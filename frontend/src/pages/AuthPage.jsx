import { useState } from "react"; // Importo hook para manejar estados locales
import { useNavigate } from "react-router-dom"; // Importo hook para redirigir tras autenticación

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true); // Estado para alternar entre Login y Registro
  const [loading, setLoading] = useState(false); // Estado para controlar el spinner o deshabilitar botón
  const navigate = useNavigate(); // Hook para navegar programáticamente
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "" }); // Estado único para el formulario

  // Función genérica para actualizar el estado del formulario según el campo que escriba el usuario
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Función asíncrona para manejar el envío al servidor Django
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el recargo natural del formulario
    setLoading(true); // Activo el estado de carga

    // Defino la URL según el estado (Login o Registro)
    const endpoint = isLogin
      ? "http://localhost:8000/api/auth/login/"
      : "http://localhost:8000/api/auth/register/";

    try {
      const response = await fetch(endpoint, {
        method: "POST", // Método de envío de datos
        headers: { "Content-Type": "application/json" }, // Especifico que envío JSON
        body: JSON.stringify(formData), // Convierto el objeto a formato de texto para la API
      });

      const data = await response.json(); // Parseo la respuesta del servidor

      if (response.ok) {
        // 1. Guardamos la información de sesión en el navegador
        localStorage.setItem("token", "session_activa");
        localStorage.setItem("user", JSON.stringify(data.user));

        // 2. Forzamos la redirección al checkout tras éxito
        navigate("/checkout", { replace: true });

        // 3. RECARGA NECESARIA: Para que el Navbar detecte cambios en localStorage y actualice su UI
        window.location.reload();
      } else {
        alert(data.error || "Error en la autenticación"); // Aviso si hubo error de credenciales/datos
      }
    } catch (error) {
      alert("Error de conexión con el servidor Django"); // Aviso si el servidor no responde
    } finally {
      setLoading(false); // Finalizo el estado de carga independientemente del resultado
    }
  };

  return (
    // Contenedor centrado que ocupa la mayor parte de la pantalla
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border-t-8 border-[#de6e28]">
        <h2 className="text-3xl font-extrabold text-center text-[#242a57] mb-2">
          {isLogin ? "INGRESAR" : "REGISTRARSE"} // Título dinámico según modo
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Renderizado condicional: El campo nombre solo se muestra en registro */}
          {!isLogin && (
            <input name="nombre" type="text" placeholder="Nombre completo" required
              className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
              onChange={handleChange} />
          )}
          {/* Input para correo */}
          <input name="email" type="email" placeholder="Correo electrónico" required
            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
            onChange={handleChange} />
          {/* Input para contraseña */}
          <input name="password" type="password" placeholder="Contraseña" required
            className="w-full px-4 py-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#0bafd4]"
            onChange={handleChange} />
            
          {/* Botón de acción principal */}
          <button type="submit" disabled={loading}
            className="w-full bg-[#1a1f3c] text-white py-4 rounded-xl font-bold hover:bg-[#242a57] transition-all">
            {loading ? "Procesando..." : (isLogin ? "Entrar" : "Crear Cuenta")}
          </button>
        </form>

        {/* Botón para alternar entre Login y Registro */}
        <div className="mt-8 text-center">
          <button onClick={() => setIsLogin(!isLogin)} className="text-[#de6e28] font-bold hover:underline">
            {isLogin ? "¿No tienes cuenta? Regístrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </div>
    </div>
  );
}