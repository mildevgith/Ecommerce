import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    // user: Guardará el objeto con nombre, email, etc. (o null si no hay nadie)
    const [user, setUser] = useState(null);
    // loading: Evita que la app se muestre antes de saber si hay una sesión activa
    const [loading, setLoading] = useState(true);

    // --- PERSISTENCIA: Al cargar la web, revisamos si ya estaba logueado ---
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('userData');

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
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
    };

    // --- FUNCIÓN DE SALIDA: Limpia todo y reinicia el estado ---
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
    };

    // Objeto con todo lo que los demás componentes pueden usar
    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user, // Truco: convierte el objeto user en un booleano (true/false)
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Si está cargando, no mostramos nada para evitar parpadeos de "Iniciar Sesión" */}
            {!loading && children}
        </AuthContext.Provider>
    );
};
