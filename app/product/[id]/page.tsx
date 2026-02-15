"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { use } from "react";
import {
  BRAND_LABELS,
  ProductCategory,
  resolveProductBrand,
} from "@/data/products";
import { useProducts } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import CartPanel from "@/components/CartPanel";

const categoryColors: Record<ProductCategory, { bg: string; text: string }> = {
  SARMS: {
    bg: "bg-purple-100 dark:bg-purple-500/20",
    text: "text-purple-700 dark:text-purple-400",
  },
  INJECTABLES: {
    bg: "bg-blue-100 dark:bg-blue-500/20",
    text: "text-blue-700 dark:text-blue-400",
  },
  PEPTIDES: {
    bg: "bg-emerald-100 dark:bg-emerald-500/20",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  ORALS: {
    bg: "bg-orange-100 dark:bg-orange-500/20",
    text: "text-orange-700 dark:text-orange-400",
  },
};

const categoryLabels: Record<ProductCategory, string> = {
  SARMS: "SARMs",
  INJECTABLES: "Injectables",
  PEPTIDES: "Peptides",
  ORALS: "Orals",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

type Props = {
  params: Promise<{ id: string }>;
};

export default function ProductDetailPage({ params }: Props) {
  const { id } = use(params);
  const { products } = useProducts();
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const { bg, text } = categoryColors[product.category];
  const brand = resolveProductBrand(product);
  const quantity = cartItems[product.id] || 0;
  const isInCart = quantity > 0;

  const relatedProducts = products
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id &&
        resolveProductBrand(p) === brand,
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen pb-20">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-sm">
          <Link
            href="/"
            className="text-text-muted hover:text-brand transition-colors"
          >
            Home
          </Link>
          <span className="text-text-muted">/</span>
          <Link
            href="/#products"
            className="text-text-muted hover:text-brand transition-colors"
          >
            Products
          </Link>
          <span className="text-text-muted">/</span>
          <span className="text-text-muted">{BRAND_LABELS[brand]}</span>
          <span className="text-text-muted">/</span>
          <span className="text-text-primary">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-badge-bg">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-badge-bg">
                <span className="text-8xl font-bold text-brand/30">
                  {getInitials(product.name)}
                </span>
              </div>
            )}

            {!product.isAvailable && (
              <div className="absolute inset-0 flex items-center justify-center bg-card-bg/70">
                <span className="rounded-full bg-warning/20 px-6 py-3 text-lg font-semibold text-warning">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-4">
              <span className="mb-3 mr-2 inline-block rounded-full border border-border px-4 py-1.5 text-sm font-semibold text-text-secondary">
                {BRAND_LABELS[brand]}
              </span>
              <span
                className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium ${bg} ${text}`}
              >
                {categoryLabels[product.category]}
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-bold text-text-primary sm:text-4xl">
              {product.name}
            </h1>

            <p className="mb-6 text-base text-text-muted">
              {product.chemicalName}
            </p>

            <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-badge-bg p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                  Strength
                </p>
                <p className="text-lg font-semibold text-text-primary">
                  {product.strength}
                </p>
              </div>
              <div className="rounded-xl bg-badge-bg p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                  Quantity
                </p>
                <p className="text-lg font-semibold text-text-primary">
                  {product.quantity}
                </p>
              </div>
              <div className="rounded-xl bg-badge-bg p-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-text-muted">
                  Status
                </p>
                <p
                  className={`text-lg font-semibold ${
                    product.isAvailable ? "text-success" : "text-warning"
                  }`}
                >
                  {product.isAvailable ? "In Stock" : "Out of Stock"}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="mb-3 text-lg font-semibold text-text-primary">
                Description
              </h2>
              <p className="leading-relaxed text-text-secondary">
                {product.description}
              </p>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-text-primary">
                {product.priceDisplay}
              </span>
            </div>

            <div className="space-y-4">
              {product.isAvailable ? (
                <div className="flex items-center justify-center rounded-xl border-2 border-border bg-card-bg">
                  {isInCart ? (
                    <div className="flex w-full items-center justify-between px-4 py-3">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="flex h-12 w-12 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-hover-bg hover:text-brand"
                        title="Decrease quantity"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="text-xl font-bold text-text-primary">
                        {quantity} in cart
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="flex h-12 w-12 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-hover-bg hover:text-brand"
                        title="Increase quantity"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => updateQuantity(product.id, 1)}
                      className="flex w-full items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-text-primary transition-colors hover:text-brand"
                    >
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Add to Cart
                    </button>
                  )}
                </div>
              ) : (
                <button
                  disabled
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-badge-bg px-8 py-4 text-lg font-semibold text-text-muted"
                >
                  Currently Unavailable
                </button>
              )}

              <Link
                href="/#products"
                className="inline-flex w-full items-center justify-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-brand"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Products
              </Link>
            </div>
          </div>
        </div>

        <CartPanel
          products={products}
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearSelection={clearCart}
        />

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-8 text-2xl font-bold text-text-primary">
              Related Products
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => {
                const relatedColors = categoryColors[relatedProduct.category];
                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.id}`}
                    className="group overflow-hidden rounded-xl border-2 border-card-border bg-card-bg p-4 transition-all duration-200 hover:border-brand/50 hover:shadow-lg"
                  >
                    <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-badge-bg">
                      {relatedProduct.imageUrl ? (
                        <Image
                          src={relatedProduct.imageUrl}
                          alt={relatedProduct.name}
                          width={400}
                          height={400}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-2xl font-bold text-brand/30">
                            {getInitials(relatedProduct.name)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${relatedColors.bg} ${relatedColors.text}`}
                    >
                      {categoryLabels[relatedProduct.category]}
                    </span>
                    <h3 className="mt-2 font-semibold text-text-primary group-hover:text-brand">
                      {relatedProduct.name}
                    </h3>
                    <p className="mt-1 text-sm text-text-muted">
                      {relatedProduct.strength} • {relatedProduct.quantity}
                    </p>
                    <p className="mt-2 font-bold text-text-primary">
                      {relatedProduct.priceDisplay}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
