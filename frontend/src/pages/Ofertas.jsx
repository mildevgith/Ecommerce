import React, { useEffect, useState } from 'react';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const BASE_URL = "http://localhost:8000";

const getImageUrl = (url) => {
    if (!url) return "https://via.placeholder.com/400x300?text=Expomarket";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${BASE_URL}${url}`;
};

export default function Ofertas() {
    const [ofertas, setOfertas] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchTodasLasOfertas = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/api/productos/`);
                if (res.ok) {
                    const data = await res.json();
                    const lista = data.results || [];
                    // Filtra dinámicamente usando el campo real de tu base de datos
                    const filtrados = lista.filter(p => p.en_oferta === true);
                    setOfertas(filtrados);
                }
            } catch (error) {
                console.error("Error al cargar la página de ofertas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTodasLasOfertas();
    }, []);

    if (loading) {
        return (
            <div className="text-center p-10 font-bold text-slate-600 bg-white min-h-screen flex items-center justify-center">
                Cargando el listado de ofertas...
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen text-slate-900 pb-12">
            <div className="container mx-auto px-4 pt-8">
                {/* Botón de retorno coherente */}
                <Link to="/" className="inline-flex items-center text-orange-500 hover:underline mb-6 gap-2 text-sm font-medium">
                    <ArrowLeft size={16} /> Volver al Inicio
                </Link>
                
                {/* Encabezado con los mismos textos del Home */}
                <div className="mb-8">
                    <span className="text-xs font-bold text-orange-500 tracking-wider uppercase block mb-1">
                        AHORRA HOY
                    </span>
                    <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
                        Ofertas Imperdibles 🔥
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 max-w-xl">
                        Listado completo de nuestros productos seleccionados con precios especiales directamente desde la base de datos.
                    </p>
                </div>
                <hr className="border-slate-100 mb-8" />
            </div>

            {/* Contenedor de Productos en Rejilla Limpia */}
            <div className="container mx-auto px-4">
                {ofertas.length === 0 ? (
                    <div className="border border-dashed border-slate-200 rounded-2xl p-16 text-center bg-slate-50">
                        <p className="text-slate-400 font-medium">No hay productos en promoción activos en el Admin de Django.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {ofertas.map((producto) => (
                            <div 
                                key={producto.id} 
                                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                            >
                                <div>
                                    {/* Contenedor Imagen con el Tag Naranja exacto */}
                                    <div className="relative overflow-hidden rounded-xl h-48 bg-slate-50 mb-4">
                                        <span className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                                            OFERTA
                                        </span>
                                        <img 
                                            src={getImageUrl(producto.imagen)} 
                                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" 
                                            alt={producto.nombre} 
                                        />
                                    </div>

                                    {/* Textos e Información */}
                                    <div className="text-center">
                                        <h3 className="text-base font-bold text-slate-800">{producto.nombre}</h3>
                                        <p className="text-slate-500 text-xs mt-1 line-clamp-2 min-h-[32px]">{producto.descripcion}</p>
                                        
                                        {/* Precios: Antes y Ahora formateados */}
                                        <div className="mt-3 flex items-center justify-center gap-2 text-xs">
                                            <span className="text-slate-400 line-through">
                                                ${producto.precio ? Number(producto.precio).toLocaleString("es-CO") : "0"}
                                            </span>
                                            <span className="text-orange-500 font-extrabold text-base">
                                                ${producto.precio_oferta ? Number(producto.precio_oferta).toLocaleString("es-CO") : "0"}
                                            </span>
                                            <span className="text-slate-400">/ Kg</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Botón de compra oscuro idéntico al Home */}
                                <button
                                    onClick={() => addToCart(producto)}
                                    className="mt-5 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={14} /> Añadir al carrito
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}