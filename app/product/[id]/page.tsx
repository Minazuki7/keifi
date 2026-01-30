"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { ProductCategory } from "@/data/products";
import { useProducts } from "@/contexts/ProductContext";
import { useSettings } from "@/contexts/SettingsContext";

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
  const { settings } = useSettings();
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const { bg, text } = categoryColors[product.category];

  const whatsappUrl = `https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent(
    product.whatsappMessage,
  )}`;

  const formUrl = `${settings.googleFormUrl}?productId=${encodeURIComponent(
    product.id,
  )}&productName=${encodeURIComponent(product.name)}`;

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
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
          <span className="text-text-primary">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-badge-bg">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
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
              <span className="text-4xl font-bold text-brand">
                {product.priceDisplay}
              </span>
            </div>

            <div className="space-y-4">
              {product.isAvailable ? (
                <>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-success px-8 py-4 text-lg font-semibold text-white transition-all duration-200 hover:bg-success-hover hover:shadow-lg hover:shadow-success/25"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Order on WhatsApp
                  </a>

                  <a
                    href={formUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-border px-8 py-4 text-base font-semibold text-text-primary transition-all duration-200 hover:border-brand hover:text-brand"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Order via Form
                  </a>
                </>
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
                        <img
                          src={relatedProduct.imageUrl}
                          alt={relatedProduct.name}
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
                    <p className="mt-2 font-bold text-brand">
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
