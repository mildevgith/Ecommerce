import axios from 'axios';

// Detecta automáticamente si estás en tu PC local o en Vercel (producción) y le añade /api/
const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const api = axios.create({
    baseURL: `${baseURL.replace(/\/$/, "")}/api`, // Asegura que siempre termine en /api
    withCredentials: true, // Importante para manejar sesiones y cookies con Django
});

export default api;
