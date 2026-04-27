import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.js';

/**
 * useAuth: El atajo maestro.
 * En lugar de importar dos cosas en tus componentes, solo importas esta función.
 */
export const useAuth = () => {
    const context = useContext(AuthContext);

    // SEGURIDAD: Si intentas usar useAuth en un componente que no está envuelto
    // por el AuthProvider (en App.js), la app te avisará con este error claro.
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }

    // Retorna { user, login, logout, isAuthenticated, loading }
    return context;
};
