import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // PERSISTENCIA REAL: Al cargar la web, recuperamos la sesión
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('userData');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Error parseando datos del usuario", e);
                localStorage.clear();
            }
        }
        setLoading(false);
    }, []);

    // FUNCIÓN DE LOGIN PARA PRODUCCIÓN
    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
    };

    // CIERRE DE SESIÓN LIMPIO
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
