import { useEffect, useState } from 'react'; // Importo hooks para estado y ciclo de vida
import { AuthContext } from './AuthContext'; // Importo el contexto creado previamente

export const AuthProvider = ({ children }) => {
    // user: Guardará el objeto con nombre, email, etc. (o null si no hay nadie)
    const [user, setUser] = useState(null);
    // loading: Evita que la app se muestre antes de saber si hay una sesión activa
    const [loading, setLoading] = useState(true);

    // --- PERSISTENCIA: Al cargar la web, revisamos si ya estaba logueado ---
    useEffect(() => {
        const token = localStorage.getItem('token'); // Recupero el token de seguridad
        const savedUser = localStorage.getItem('userData'); // Recupero los datos del usuario

        if (token && savedUser) {
            try {
                // Convertimos el texto de localStorage de nuevo a un objeto JS
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error parseando datos del usuario", e);
                localStorage.clear(); // Si los datos están corruptos, mejor limpiar todo
            }
        }
        setLoading(false); // Ya terminamos de revisar, la app puede arrancar
    }, []);

    // --- FUNCIÓN DE ENTRADA: Se llama desde el formulario de Login ---
    const login = (userData, token) => {
        localStorage.setItem('token', token); // Guardo el token para sesiones futuras
        localStorage.setItem('userData', JSON.stringify(userData)); // Guardo datos como texto JSON
        setUser(userData); // Actualizo el estado global
    };

    // --- FUNCIÓN DE SALIDA: Limpia todo y reinicia el estado ---
    const logout = () => {
        localStorage.removeItem('token'); // Elimino el token de autenticación
        localStorage.removeItem('userData'); // Elimino los datos del usuario
        setUser(null); // Reseteo el estado de usuario a vacío
    };

    // Objeto con todo lo que los demás componentes pueden usar (la "radio")
    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user, // Truco: convierte el objeto user en un booleano (true si hay usuario, false si es null)
        loading
    };

    return (
        // Proveedor del contexto que entrega el objeto 'value' a toda la aplicación
        <AuthContext.Provider value={value}>
            {/* Si está cargando, no mostramos nada para evitar parpadeos de "Iniciar Sesión" */}
            {!loading && children}
        </AuthContext.Provider>
    );
};