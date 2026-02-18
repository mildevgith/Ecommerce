// src/components/Hero.jsx
export default function Hero() {
  return (
    <section className="relative bg-blue-900 text-white py-20 px-6 text-center">
      {/* Imagen de fondo con opacidad */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1603217192223-3b681b69f110?auto=format&fit=crop&w=1200&q=80')",
        }}
      ></div>

      {/* Contenido superpuesto */}
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Bienvenido a Expomarket
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Los mejores pescados y mariscos frescos, directo del mar a tu mesa 🐟
        </p>
        <a
          href="/productos"
          className="bg-white text-blue-900 font-semibold py-3 px-6 rounded-lg hover:bg-blue-100 transition"
        >
          Ver productos
        </a>
      </div>
    </section>
  );
}
