import axios from 'axios';

// Detecta automáticamente si estás en tu PC local o en Vercel (producción)
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Importante para manejar sesiones y cookies con Django
});

export default api;
