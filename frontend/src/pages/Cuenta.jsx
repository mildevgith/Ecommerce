import {
  KeyRound,
  Loader2,
  LogOut,
  Mail, MessageSquare, User,
  UserPlus
} from 'lucide-react';
import { useState } from 'react';

const styles = {
  card: "bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]",
  input: "w-full px-5 py-4 bg-slate-100/50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl transition-all outline-none font-medium",
  btnPrimary: "w-full py-4 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50",
};

const ExpomarFullStackApp = () => {
  const [step, setStep] = useState('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [method, setMethod] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);

  const API_URL = 'http://localhost:8000/api/auth';

  // --- LÓGICA DE REGISTRO REAL ---
  const handleRegister = async () => {
    if (!email || !whatsapp) return alert("Completa todos los campos");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, whatsapp }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("¡Registro exitoso! Ahora verifica tu acceso.");
        setStep('method');
      } else {
        alert(data.error || "Error en el registro");
      }
    } catch (err) {
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  // --- SOLICITAR CÓDIGO (OTP) REAL ---
  const handleRequestOtp = async (selectedMethod) => {
    setLoading(true);
    setMethod(selectedMethod);
    try {
      const response = await fetch(`${API_URL}/request-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, channel: selectedMethod }),
      });
      if (response.ok) {
        setStep('otp');
      } else {
        const data = await response.json();
        alert(data.error || "Usuario no encontrado");
      }
    } catch (err) {
      alert("Error al solicitar el código");
    } finally {
      setLoading(false);
    }
  };

  // --- VERIFICAR CÓDIGO REAL ---
  const handleVerifyOtp = async () => {
    const fullCode = otp.join('');
    if (fullCode.length < 4) return alert("Ingresa el código completo");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/verify-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      });
      const data = await response.json();
      if (response.ok) {
        setStep('dashboard');
      } else {
        alert(data.error || "Código incorrecto");
      }
    } catch (err) {
      alert("Error en la verificación");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className={`max-w-md w-full p-10 rounded-[40px] ${styles.card}`}>

        {/* LOGIN */}
        {step === 'login' && (
          <div className="space-y-6">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black shadow-lg">E</div>
              <h2 className="text-3xl font-black text-slate-800">Mi Cuenta</h2>
              <p className="text-slate-500 font-medium">Ingresa tu correo</p>
            </div>
            <input type="email" placeholder="email@ejemplo.com" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={() => handleRequestOtp('Email')} disabled={loading} className={styles.btnPrimary}>
                {loading ? <Loader2 className="animate-spin"/> : "Continuar"}
            </button>
            <button onClick={() => setStep('register')} className="w-full py-4 text-blue-600 font-bold flex items-center justify-center gap-2">
              <UserPlus size={18}/> Crear cuenta nueva
            </button>
          </div>
        )}

        {/* REGISTRO */}
        {step === 'register' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-center tracking-tighter">Regístrate</h2>
            <input type="email" placeholder="Correo electrónico" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="tel" placeholder="WhatsApp (ej: 57310...)" className={styles.input} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            <button onClick={handleRegister} disabled={loading} className={styles.btnPrimary}>
                {loading ? <Loader2 className="animate-spin"/> : "Registrarme"}
            </button>
            <button onClick={() => setStep('login')} className="w-full text-slate-400 font-bold">Volver al login</button>
          </div>
        )}

        {/* MÉTODO */}
        {step === 'method' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-center">Verificación</h2>
            <button onClick={() => handleRequestOtp('WhatsApp')} className="w-full flex items-center p-5 bg-white border rounded-2xl hover:border-blue-500 transition-all">
                <MessageSquare className="text-green-500" />
                <span className="ml-4 font-bold">Vía WhatsApp</span>
            </button>
            <button onClick={() => handleRequestOtp('Email')} className="w-full flex items-center p-5 bg-white border rounded-2xl hover:border-blue-500 transition-all">
                <Mail className="text-blue-500" />
                <span className="ml-4 font-bold">Vía Correo</span>
            </button>
          </div>
        )}

        {/* OTP */}
        {step === 'otp' && (
          <div className="space-y-6 text-center">
            <KeyRound className="mx-auto text-blue-600" size={40} />
            <h2 className="text-2xl font-black">Ingresa el código</h2>
            <div className="flex justify-center gap-2">
              {otp.map((data, index) => (
                <input
                  key={index} id={`otp-${index}`} type="text" maxLength="1"
                  className="w-12 h-14 text-center text-xl font-bold bg-slate-100 rounded-xl outline-none focus:border-blue-500"
                  value={data} onChange={e => handleOtpChange(e.target.value, index)}
                />
              ))}
            </div>
            <button onClick={handleVerifyOtp} disabled={loading} className={styles.btnPrimary}>
                {loading ? <Loader2 className="animate-spin"/> : "Verificar"}
            </button>
          </div>
        )}

        {/* DASHBOARD */}
        {step === 'dashboard' && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center"><User size={40} /></div>
            <h2 className="text-2xl font-black tracking-tighter">¡Hola de nuevo!</h2>
            <p className="text-slate-500 mb-8 font-medium">{email}</p>
            <button onClick={() => setStep('login')} className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-3 hover:bg-red-50 rounded-xl transition-all">
                <LogOut size={18}/> Cerrar Sesión
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ExpomarFullStackApp;
