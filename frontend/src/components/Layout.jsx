import { Outlet } from "react-router-dom"; // El "espacio en blanco" donde se cargan las páginas
import Footer from "./Footer";
import Navbar from "./Navbar";

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
