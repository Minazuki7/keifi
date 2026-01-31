"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type CartContextType = {
  cartItems: Record<string, number>;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<Record<string, number>>({});

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        const { [productId]: removed, ...rest } = prev;
        void removed;
        return rest;
      }
      return { ...prev, [productId]: quantity };
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setCartItems((prev) => {
      const { [productId]: removed, ...rest } = prev;
      void removed;
      return rest;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems({});
  }, []);

  const totalItems = Object.values(cartItems).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
