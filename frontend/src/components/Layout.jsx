import { Outlet } from "react-router-dom"; // Importo el componente que actúa como marcador de posición para las rutas hijas
import Footer from "./Footer"; // Importo el componente del pie de página
import Navbar from "./Navbar"; // Importo el componente de la barra de navegación

// Defino el componente Layout que envolverá a todas las páginas de la aplicación
export default function Layout() {
  return (
    /* flex-col y min-h-screen:
       Esto asegura que el Footer siempre se vaya al fondo de la pantalla,
       incluso si la página tiene poco contenido.
    */
    <div className="flex flex-col min-h-screen bg-white">

      {/* NAVBAR GLOBAL:
          Al estar aquí, el Navbar no se vuelve a cargar cuando cambias de página,
          lo que hace que la navegación se sienta instantánea.
      */}
      <Navbar />

      {/* CONTENEDOR DINÁMICO:
          flex-grow hace que este espacio ocupe todo el tamaño disponible
          empujando el Footer hacia abajo.
      */}
      <main className="flex-grow">
        {/* OUTLET:
            Es como un "marco de fotos". Aquí es donde React Router
            va a inyectar componentes como Home, Productos, Cuenta, etc.
        */}
        <Outlet />
      </main>

      {/* FOOTER GLOBAL: Aparecerá en todas las rutas que usen este Layout */}
      <Footer />
    </div>
  );
}