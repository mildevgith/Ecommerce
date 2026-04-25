import axios from "axios";
import { Loader2, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  card: "bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-[32px] p-8 animate-in fade-in zoom-in duration-300",
  input:
    "w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl transition-all outline-none font-medium text-slate-700",
  btnPrimary:
    "w-full py-4 bg-slate-900 hover:bg-orange-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50",
};

const Cuenta = () => {
  const [step, setStep] = useState("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const API_BASE = "http://127.0.0.1:8000/api";

  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      loadDashboard(savedEmail);
    }
  }, []);

  const loadDashboard = async (userEmail) => {
    try {
      const res = await axios.get(
        `${API_BASE}/user/dashboard/?email=${userEmail}`,
      );
      setUserData(res.data);
      setStep("dashboard");
    } catch (err) {
      localStorage.removeItem("userEmail");
      setStep("login");
    }
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) return alert("Completa todos los campos");

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/login/`, {
        email,
        password,
      });
      if (res.status === 200) {
        // Guardamos los datos de sesión
        localStorage.setItem("userEmail", email);
        localStorage.setItem("isLoggedIn", "true");

        // Notificamos al Navbar para que se actualice
        window.dispatchEvent(new Event("userLogin"));

        // Cargamos los datos del usuario para el dashboard
        loadDashboard(email);

        // --- ESTA ES LA LÍNEA QUE DEBES AGREGAR ---
        navigate("/");
      }
    } catch (err) {
      alert("Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/auth/register/`, {
        email,
        password,
        whatsapp,
      });
      if (res.status === 201 || res.status === 200) {
        alert("Registro exitoso, ahora puedes ingresar");
        setStep("login");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUserData(null);
    setStep("login");
    window.dispatchEvent(new Event("userLogin"));
    navigate("/");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4 bg-slate-50/50">
      <div className="w-full max-w-md">
        {step === "login" && (
          <div className={styles.card}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">
                Ingresar
              </h2>
              <p className="text-slate-400 text-sm">
                Gestiona tus pedidos de mariscos
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Correo electrónico"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={handleLogin}
                disabled={loading}
                className={styles.btnPrimary}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
              </button>
              <button
                onClick={() => setStep("register")}
                className="w-full text-orange-600 font-bold text-sm mt-4"
              >
                ¿No tienes cuenta? Regístrate aquí
              </button>
            </div>
          </div>
        )}

        {step === "register" && (
          <div className={styles.card}>
            <h2 className="text-2xl font-black text-center mb-6 uppercase italic tracking-tighter">
              Crear Perfil
            </h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Correo"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="tel"
                placeholder="WhatsApp"
                className={styles.input}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
              <button
                onClick={handleRegister}
                disabled={loading}
                className={styles.btnPrimary}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Registrarme"}
              </button>
              <button
                onClick={() => setStep("login")}
                className="w-full text-slate-400 font-bold text-sm"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </div>
        )}

        {step === "dashboard" && userData && (
          <div className={styles.card + " text-center"}>
            <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={40} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-slate-800">
              Bienvenido
            </h2>
            <p className="text-slate-500 mb-6">
              {userData?.profile?.user?.email || email}
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl text-left mb-6 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                WhatsApp de contacto
              </p>
              <p className="font-bold text-slate-700">
                {userData?.profile?.whatsapp || "No registrado"}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Estado de cuenta
                </p>
                <p className="text-sm font-bold text-green-600 flex items-center gap-1">
                  Cliente Verificado ✅
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-3 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={18} /> Cerrar Sesión de Expomar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cuenta;
