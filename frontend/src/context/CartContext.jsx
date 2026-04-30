import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Intentamos cargar el carrito guardado en el navegador
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('expomarket_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Cada vez que el carrito cambie, lo guardamos en el localStorage
    useEffect(() => {
        localStorage.setItem('expomarket_cart', JSON.stringify(cart));
    }, [cart]);

    // Función para añadir productos
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                // Si ya existe, le sumamos 1 a la cantidad
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            // Si es nuevo, lo agregamos con cantidad 1
            return [...prevCart, { ...product, cantidad: 1 }];
        });
    };

    // Función para sumar cantidad (+1)
    const updateQuantity = (id, amount) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad + amount) } : item
            )
        );
    };

    // Función para eliminar (o restar hasta desaparecer)
    const removeFromCart = (id) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
            ).filter(item => item.cantidad > 0)
        );
    };

    const clearCart = () => setCart([]);

    // Cálculo total de items para la burbuja del Navbar
    const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el carrito fácilmente
export const useCart = () => useContext(CartContext);
