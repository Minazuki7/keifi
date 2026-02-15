"use client";

import { useMemo, useState } from "react";
import {
  BRAND_LABELS,
  ProductBrand,
  ProductCategory,
  resolveProductBrand,
} from "@/data/products";
import { useProducts } from "@/contexts/ProductContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useCart } from "@/contexts/CartContext";
import CategoryTabs from "@/components/CategoryTabs";
import ProductGrid from "@/components/ProductGrid";
import CartPanel from "@/components/CartPanel";
import Footer from "@/components/Footer";

const brandOptions: Array<ProductBrand | "ALL"> = ["ALL", "KEIFI", "SYROCS"];

const brandOptionLabels: Record<ProductBrand | "ALL", string> = {
  ALL: "Both Brands",
  KEIFI: BRAND_LABELS.KEIFI,
  SYROCS: BRAND_LABELS.SYROCS,
};

export default function Home() {
  const { products } = useProducts();
  const { settings } = useSettings();
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const [selectedBrand, setSelectedBrand] = useState<ProductBrand | "ALL">(
    "ALL",
  );

  const [selectedCategory, setSelectedCategory] = useState<
    ProductCategory | "ALL"
  >("ALL");

  const handleBrandChange = (brand: ProductBrand | "ALL") => {
    setSelectedBrand(brand);
    setSelectedCategory("ALL");
  };

  const brandProducts = products.filter((product) => {
    if (selectedBrand === "ALL") return true;
    return resolveProductBrand(product) === selectedBrand;
  });

  const availableCategories = useMemo(() => {
    const order: ProductCategory[] = [
      "INJECTABLES",
      "PEPTIDES",
      "ORALS",
      "SARMS",
    ];
    const set = new Set(brandProducts.map((item) => item.category));
    return order.filter((category) => set.has(category));
  }, [brandProducts]);

  const visibleProducts =
    selectedCategory === "ALL"
      ? brandProducts
      : brandProducts.filter(
          (product) => product.category === selectedCategory,
        );

  const availableCount = visibleProducts.filter(
    (item) => item.isAvailable,
  ).length;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden border-b border-border bg-card-bg">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source
            src="/Laboratory Experiment 4K Stock Footage.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.12)_0%,transparent_40%),radial-gradient(circle_at_85%_35%,rgba(255,255,255,0.08)_0%,transparent_35%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex rounded-full border border-white/20 bg-black/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-sm">
              Ghost Catalogue
            </p>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Two brands. One clean catalogue.
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Explore the full Ghost product line across Keifi and Syrocs.
              Switch brand, pick a category, and place your order in seconds.
            </p>

            <div className="mx-auto mb-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-3">
              {brandOptions.map((brand) => {
                const isActive = selectedBrand === brand;
                const productCount = products.filter(
                  (product) =>
                    brand === "ALL" || resolveProductBrand(product) === brand,
                ).length;

                return (
                  <button
                    key={brand}
                    onClick={() => {
                      handleBrandChange(brand);
                    }}
                    className={`rounded-2xl border px-5 py-4 text-left transition-all ${
                      isActive
                        ? "border-white/70 bg-white/15 shadow-md"
                        : "border-white/25 bg-black/35 hover:border-white/50"
                    }`}
                  >
                    <p className="text-sm text-white/70">Brand</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {brandOptionLabels[brand]}
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      {productCount} items
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 font-semibold text-neutral-900 transition-colors hover:bg-neutral-200"
              >
                Browse {brandOptionLabels[selectedBrand]}
              </a>
              <a
                href={`https://wa.me/${settings.whatsappPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-success px-7 py-3 font-semibold text-success transition-colors hover:bg-success/15"
              >
                Quick WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card-bg py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
              {brandOptionLabels[selectedBrand]} categories
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {availableCount} available of {visibleProducts.length} shown
            </p>
          </div>
          <div className="mx-auto flex justify-center">
            <CategoryTabs
              categories={availableCategories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>
        </div>
      </section>

      <section id="products" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-14">
            <h2 className="mb-3 text-3xl font-bold text-text-primary sm:text-4xl">
              {brandOptionLabels[selectedBrand]} Product List
            </h2>
            <p className="mx-auto max-w-xl text-text-secondary">
              Filtered catalogue from Ghost. Add products to cart and checkout
              directly on WhatsApp.
            </p>
          </div>
          <ProductGrid
            products={brandProducts}
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
