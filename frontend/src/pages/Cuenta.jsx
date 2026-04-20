import {
  Loader2, LogOut, User
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importamos el hook de navegación

const styles = {
  card: "bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl rounded-[32px] p-8",
  input: "w-full px-5 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-medium text-slate-700",
  btnPrimary: "w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50",
};

const Cuenta = () => {
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate(); // Inicializamos la navegación
  const API_BASE = 'http://127.0.0.1:8000/api';

  useEffect(() => {
    const savedEmail = localStorage.getItem('expomar_email');
    if (savedEmail) {
      loadDashboard(savedEmail);
    }
  }, []);

  const loadDashboard = async (userEmail) => {
    try {
      const res = await axios.get(`${API_BASE}/user/dashboard/?email=${userEmail}`);
      setUserData(res.data);
      setStep('dashboard');
    } catch (err) {
      console.error("Error al cargar perfil:", err);
      localStorage.removeItem('expomar_email');
      setStep('login');
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !whatsapp) return alert("Completa todos los campos");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/register/`, { email, password, whatsapp });
      alert("¡Cuenta creada! Ahora inicia sesión.");
      setStep('login');
    } catch (err) {
      alert(err.response?.data?.error || "Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) return alert("Ingresa tus credenciales");
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/auth/verify/`, { email, password });

      // 1. Guardamos la sesión
      localStorage.setItem('expomar_email', email);

      // 2. Cargamos los datos del usuario
      await loadDashboard(email);

      // 3. ¡REDIRECCIÓN AL HOME!
      // Usamos un pequeño timeout para que el usuario vea el cambio de estado antes de irse
      setTimeout(() => {
        navigate('/');
      }, 500);

    } catch (err) {
      console.error(err);
      alert("Credenciales incorrectas.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('expomar_email');
    setUserData(null);
    setStep('login');
    navigate('/'); // También redirigimos al cerrar sesión
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* FORMULARIO DE LOGIN */}
        {step === 'login' && (
          <div className={styles.card}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase italic">Ingresar</h2>
              <p className="text-slate-400 text-sm">Gestiona tus pedidos de mariscos</p>
            </div>
            <div className="space-y-4">
              <input type="email" placeholder="Correo electrónico" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Contraseña" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
              <button onClick={handleLogin} disabled={loading} className={styles.btnPrimary}>
                {loading ? <Loader2 className="animate-spin"/> : "Entrar"}
              </button>
              <button onClick={() => setStep('register')} className="w-full text-blue-600 font-bold text-sm mt-4">¿No tienes cuenta? Regístrate aquí</button>
            </div>
          </div>
        )}

        {/* FORMULARIO DE REGISTRO */}
        {step === 'register' && (
          <div className={styles.card}>
            <h2 className="text-2xl font-black text-center mb-6 uppercase italic">Crear Perfil</h2>
            <div className="space-y-4">
              <input type="email" placeholder="Correo" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
              <input type="password" placeholder="Contraseña" className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} />
              <input type="tel" placeholder="WhatsApp" className={styles.input} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              <button onClick={handleRegister} disabled={loading} className={styles.btnPrimary}>
                {loading ? <Loader2 className="animate-spin"/> : "Registrarme"}
              </button>
              <button onClick={() => setStep('login')} className="w-full text-slate-400 font-bold text-sm">Volver al inicio de sesión</button>
            </div>
          </div>
        )}

        {/* DASHBOARD (VISTA CUENTA) */}
        {step === 'dashboard' && userData && (
          <div className="bg-white rounded-[32px] shadow-xl p-8 border border-slate-100 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <User size={40} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Bienvenido</h2>
            <p className="text-slate-500 mb-6">{userData.profile.user.email}</p>

            <div className="bg-slate-50 p-4 rounded-2xl text-left mb-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">WhatsApp de contacto</p>
              <p className="font-bold text-slate-700">{userData.profile.whatsapp}</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-3 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={18}/> Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cuenta;
