"use client";

import { useState } from "react";
import { ProductCategory } from "@/data/products";
import { useProducts } from "@/contexts/ProductContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useCart } from "@/contexts/CartContext";
import CategoryTabs from "@/components/CategoryTabs";
import ProductGrid from "@/components/ProductGrid";
import CartPanel from "@/components/CartPanel";
import Footer from "@/components/Footer";

const categories: ProductCategory[] = [
  "INJECTABLES",
  "PEPTIDES",
  "ORALS",
  "SARMS",
];

export default function Home() {
  const { products } = useProducts();
  const { settings } = useSettings();
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();

  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "ALL"
  >("ALL");

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-200/50 via-transparent to-transparent dark:from-neutral-800/50" />
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-neutral-300/30 blur-3xl dark:bg-neutral-700/30" />
        <div className="absolute -right-40 top-20 h-80 w-80 rounded-full bg-neutral-400/20 blur-3xl dark:bg-neutral-600/20" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-text-primary">Keifi</span>{" "}
              <span className="text-text-muted">Performance Products</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-text-secondary sm:text-xl">
              Premium quality compounds for performance optimization and
              recovery. All products are carefully sourced and tested for purity
              and effectiveness.{" "}
              <span className="font-medium text-warning">Use responsibly.</span>
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-xl bg-neutral-900 dark:bg-neutral-100 px-8 py-4 text-base font-semibold text-white dark:text-neutral-900 transition-all duration-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 hover:shadow-lg sm:text-lg"
              >
                Browse Products
              </a>
              <a
                href={`https://wa.me/${settings.whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-success bg-transparent px-8 py-4 text-base font-semibold text-success transition-all duration-200 hover:bg-success/10 sm:text-lg"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card-bg py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-xl font-bold text-text-primary sm:text-2xl">
            Browse by Category
          </h2>
          <CategoryTabs
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </section>

      <section id="products" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="mb-3 text-3xl font-bold text-text-primary sm:text-4xl">
              Our Products
            </h2>
            <p className="mx-auto max-w-xl text-text-secondary">
              Browse our selection of premium performance products. Select
              multiple items and order them all at once via WhatsApp.
            </p>
          </div>
          <ProductGrid
            products={products}
            selectedCategory={selectedCategory}
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
          />
        </div>
      </section>

      <Footer />

      <CartPanel
        products={products}
        cartItems={cartItems}
        onClearSelection={clearCart}
        onRemoveItem={removeItem}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
}
