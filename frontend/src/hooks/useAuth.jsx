import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';

// Este es el Hook que usarás en el Navbar y el Login
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};
