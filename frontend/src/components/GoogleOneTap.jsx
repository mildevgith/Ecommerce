import { useGoogleOneTapLogin } from '@react-oauth/google';

export default function GoogleOneTap({ onSuccessLogin }) {
  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential: credentialResponse.credential }),
        });

        const data = await res.json();
        if (res.ok) {
          // Guardamos los tokens con la llave 'token' que usa tu ProtectedRoute
          localStorage.setItem('token', data.access);
          localStorage.setItem('refresh_token', data.refresh);

          if (onSuccessLogin) {
            onSuccessLogin(data);
          } else {
            window.location.href = "/"; // Redirige al inicio o recarga
          }
        } else {
          console.error("Error del backend al autenticar:", data);
        }
      } catch (error) {
        console.error('Error de red autenticando con Google:', error);
      }
    },
    onError: () => {
      console.log('Google One Tap cerrado o cancelado por el usuario');
    },
  });

  return null;
}
