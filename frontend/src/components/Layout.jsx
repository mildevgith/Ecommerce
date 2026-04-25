import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* El Navbar solo se declara aquí para evitar duplicados */}
      <Navbar />

      <main className="flex-grow">
        {/* Aquí se inyectan las páginas. El espacio se maneja internamente en cada una */}
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
