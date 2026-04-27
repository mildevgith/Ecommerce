import { createContext } from 'react';

/**
 * AuthContext: Es como una "emisora de radio" privada.
 * Aquí se transmitirá la información del usuario (nombre, email, token)
 * para que cualquier componente (Navbar, Carrito, Cuenta) pueda "sintonizar"
 * y saber si el usuario está logueado o no.
 */
export const AuthContext = createContext();
