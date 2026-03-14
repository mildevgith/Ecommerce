import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import camaronPrecoHero from "../assets/camaronPrecoHero.jpg";
import hero3 from "../assets/hero3.jpeg";

export default function Nosotros() {
  return (
    <div className="pt-24 text-gray-700 overflow-hidden">
      <section className="relative w-full h-[500px]">
        <motion.img
          src={camaronPrecoHero}
          alt="Frescura marina"
          className="w-full h-full object-cover brightness-90"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />

        <div className="absolute inset-0 bg-gradient from-[#242a57]/80 via-[#0bafd4]/30 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
          >
            <span className="text-[#0bafd4]">Expomarket:</span>
            <br />
            Sabor auténtico del mar
          </motion.h1>

          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10 text-blue-100"
          >
            Más que una empresa, somos una familia comprometida con llevar el sabor del océano
            a tu hogar con calidad, frescura y responsabilidad.
          </motion.p>

          {/* Botón animado */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Link
              to="/productos"
              className="bg-[#de6e28] hover:bg-[#e98241] text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              Quiero hacer una compra
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Nuestra historia */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#242a57]">
            Nuestra Historia
          </h2>

          <p className="mb-5 leading-relaxed text-lg text-gray-700">
            <strong className="text-[#0bafd4]">Expomarket</strong> nació con una visión clara:
            acercar a cada familia el sabor más puro y fresco del mar. Durante más de una década,
            hemos trabajado junto a comunidades pesqueras locales, fomentando la pesca sostenible
            y el respeto por el entorno marino.
          </p>

          <p className="mb-5 leading-relaxed text-lg text-gray-700">
            Nuestra pasión por la calidad se refleja en cada producto que entregamos. Nos esforzamos
            por mantener la frescura desde el primer momento hasta que llega a tu mesa, garantizando
            una experiencia auténtica y confiable.
          </p>

          <p className="italic text-[#de6e28] font-semibold text-lg">
            “Del mar a tu hogar, con la frescura que mereces.”
          </p>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500"
        >
          <img
            src={hero3}
            alt="Productos del mar frescos"
            className="w-full h-[400px] object-cover"
          />
        </motion.div>
      </section>

      {/* Nuestros valores */}
      <section className="bg-gradient-to from-[#f9fafc] to-[#eef4ff] py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-10 text-[#242a57]"
          >
            Nuestros Valores
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                titulo: "Calidad",
                color: "#0bafd4",
                descripcion:
                  "Seleccionamos cuidadosamente cada producto, asegurando estándares de excelencia en toda la cadena de suministro.",
              },
              {
                titulo: "Sostenibilidad",
                color: "#de6e28",
                descripcion:
                  "Promovemos prácticas responsables que respetan el equilibrio de nuestros océanos y apoyan la pesca artesanal.",
              },
              {
                titulo: "Confianza",
                color: "#242a57",
                descripcion:
                  "Nuestra reputación está construida sobre la transparencia, la ética y el compromiso constante con nuestros clientes.",
              },
            ].map((valor, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-2 duration-300 border-t-4"
                style={{ borderTopColor: valor.color }}
              >
                <h3 className="text-2xl font-semibold mb-3" style={{ color: valor.color }}>
                  {valor.titulo}
                </h3>
                <p className="text-gray-600 leading-relaxed">{valor.descripcion}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cierre con mensaje de marca */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="bg-gradient-to from-[#242a57] to-[#0bafd4] text-white py-16 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Comprometidos con la frescura y la confianza
        </h2>
        <p className="max-w-3xl mx-auto text-lg leading-relaxed text-blue-100">
          En Expomarket creemos que cada producto cuenta una historia.
          Por eso trabajamos para que tu experiencia sea tan fresca, natural y auténtica como el mar mismo.
        </p>
      </motion.section>
    </div>
  );
}
