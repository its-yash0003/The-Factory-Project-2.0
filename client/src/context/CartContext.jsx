import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('factory_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error('Error loading cart:', err);
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('factory_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((product, size, quantity = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.productId === product._id && item.size === size
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity
        };
        return newCart;
      }

      return [
        ...prevCart,
        {
          productId: product._id,
          productName: product.name,
          price: product.price,
          size,
          quantity,
          image: product.images?.[0] || null
        }
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId, size) => {
    setCart(prevCart =>
      prevCart.filter(item => !(item.productId === productId && item.size === size))
    );
  }, []);

  const updateQuantity = useCallback((productId, size, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    isLoaded,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
