"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { products as defaultProducts, Product } from "@/data/products";

const normalizeProducts = (items: Product[]): Product[] =>
  items.map((product) => ({
    ...product,
    brand: product.brand ?? "KEIFI",
  }));

type ProductContextType = {
  products: Product[];
  isLoading: boolean;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  resetToDefaults: () => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(
    normalizeProducts(defaultProducts),
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(normalizeProducts(data));
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const saveProducts = useCallback(async (newProducts: Product[]) => {
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProducts),
      });
    } catch {}
  }, []);

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          const newProduct = { ...p, ...updates };
          if (updates.price !== undefined) {
            newProduct.priceDisplay = `${updates.price} TND`;
          }
          if (updates.name !== undefined) {
            newProduct.whatsappMessage = `Hi, I'm interested in ordering ${updates.name}. Please confirm availability.`;
          }
          return newProduct;
        }
        return p;
      });
      saveProducts(updated);
      return updated;
    });
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => {
      const updated = [
        ...prev,
        { ...product, brand: product.brand ?? "KEIFI" },
      ];
      saveProducts(updated);
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      saveProducts(updated);
      return updated;
    });
  };

  const resetToDefaults = () => {
    const defaults = normalizeProducts(defaultProducts);
    setProducts(defaults);
    saveProducts(defaults);
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        updateProduct,
        addProduct,
        deleteProduct,
        resetToDefaults,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
