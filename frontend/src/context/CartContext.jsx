import { createContext, useState, useEffect, useContext } from 'react'; // Importo hooks necesarios

// Creo el contexto para que cualquier componente pueda acceder al carrito
const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Intentamos cargar el carrito guardado en el navegador (inicialización perezosa)
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('expomarket_cart');
        return savedCart ? JSON.parse(savedCart) : []; // Si hay datos, los convierto; si no, array vacío
    });

    // Cada vez que el carrito cambie, lo guardamos en el localStorage automáticamente
    useEffect(() => {
        localStorage.setItem('expomarket_cart', JSON.stringify(cart));
    }, [cart]);

    // Función para añadir productos
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Si ya existe, le sumamos 1 a la cantidad mediante un map
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            // Si es un producto nuevo, lo agregamos al array con cantidad inicial de 1
            return [...prevCart, { ...product, cantidad: 1 }];
        });
    };

    // Función para sumar o restar cantidad mediante un incremento o decremento
    const updateQuantity = (id, amount) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + amount) } : item
            )
        );
    };

    // Función para eliminar un producto o reducir su cantidad hasta desaparecer
    const removeFromCart = (id) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
            ).filter(item => item.cantidad > 0) // Si la cantidad llega a 0, el filter lo elimina
        );
    };

    // Función para vaciar el carrito completamente
    const clearCart = () => setCart([]);

    // Cálculo total de ítems para mostrar en la burbuja del Navbar
    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        // Proveedor del contexto que expone las funciones y datos a toda la app
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el carrito fácilmente desde cualquier componente
export const useCart = () => useContext(CartContext);