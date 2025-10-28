import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load from localStorage if exists
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Save cart to localStorage on changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item._id === product._id);
      if (existing) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };

  // Remove one quantity of an item or the item if qty === 1
  const removeFromCart = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item._id === id) {
            if (item.qty > 1) return { ...item, qty: item.qty - 1 };
            return null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove item entirely
  const removeItemCompletely = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== id));
  };

  // Clear the entire cart
  const clearCart = () => setCartItems([]);

  // Total quantity
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Total price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        removeItemCompletely,
        clearCart,
        totalQty,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
