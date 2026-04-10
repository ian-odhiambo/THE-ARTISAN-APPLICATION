import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount - robust
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(item => 
            item && 
            typeof item === 'object' &&
            item._id && 
            typeof item._id === 'string' && 
            item._id.length === 24
          );
          if (validItems.length !== parsed.length) {
            console.log('Cart cleaned:', validItems.length, '/', parsed.length);
            localStorage.setItem('cartItems', JSON.stringify(validItems));
          }
          setCartItems(validItems);
        } else {
          console.warn('Cart not array:', parsed);
        }
      } catch (e) {
        console.error('Corrupt cart JSON:', e);
        localStorage.removeItem('cartItems');
      }
    }
  }, []);

  //  Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  //  Add to cart (with quantity handling)
  const addToCart = (product) => {
  setCartItems(prev => {
    const existing = prev.find(item => item._id === product._id);
    if (existing) {
      return prev.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    }
    //  include artisan in cart item and use discounted price if provided
    const price = product.price || product.originalPrice;
    return [...prev, { ...product, quantity: 1, artisan: product.artisan, price }];
  });
};

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, setCartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
