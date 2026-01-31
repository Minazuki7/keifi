"use client";

import { useRouter } from "next/navigation";
import { Product, ProductCategory } from "@/data/products";

type ProductCardProps = {
  product: Product;
  quantity?: number;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
};

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

export default function ProductCard({
  product,
  quantity = 0,
  onUpdateQuantity,
}: ProductCardProps) {
  const router = useRouter();
  const { bg, text } = categoryColors[product.category];
  const isInCart = quantity > 0;

  const handleCardClick = () => {
    router.push(`/product/${product.id}`);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handleCardClick}
      className={`
        group relative flex flex-col overflow-hidden rounded-2xl border-2 
        transition-all duration-300 cursor-pointer
        ${
          isInCart
            ? "border-brand shadow-lg shadow-brand/20"
            : "border-card-border hover:border-brand/50"
        }
        bg-card-bg
        hover:shadow-xl
        ${!product.isAvailable ? "opacity-75" : ""}
      `}
    >
      {isInCart && (
        <div className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-100 text-sm font-bold text-white dark:text-neutral-900 shadow-md">
          {quantity}
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden bg-badge-bg">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-badge-bg">
            <span className="text-4xl font-bold text-brand/30">
              {getInitials(product.name)}
            </span>
          </div>
        )}

        {!product.isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-card-bg/70">
            <span className="rounded-full bg-warning/20 px-4 py-2 text-sm font-semibold text-warning">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="mb-3">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${bg} ${text}`}
          >
            {categoryLabels[product.category]}
          </span>
        </div>

        <h3 className="mb-1 text-lg font-semibold text-text-primary group-hover:text-brand transition-colors">
          {product.name}
        </h3>

        <p className="mb-2 text-xs text-text-muted">{product.chemicalName}</p>

        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-md bg-badge-bg px-2 py-1 text-xs font-medium text-text-secondary">
            {product.strength}
          </span>
          <span className="inline-flex items-center rounded-md bg-badge-bg px-2 py-1 text-xs font-medium text-text-secondary">
            {product.quantity}
          </span>
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-text-secondary line-clamp-2">
          {product.description}
        </p>

        <div className="mb-4">
          <span className="text-2xl font-bold text-text-primary">
            {product.priceDisplay}
          </span>
        </div>

        <div className="mt-auto" onClick={stopPropagation}>
          <div className="flex items-center justify-center">
            {product.isAvailable ? (
              onUpdateQuantity && (
                <div className="flex items-center rounded-lg border-2 border-border bg-transparent">
                  {isInCart ? (
                    <>
                      <button
                        onClick={() =>
                          onUpdateQuantity(product.id, quantity - 1)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-l-md text-text-primary transition-colors hover:bg-hover-bg hover:text-brand"
                        title="Decrease quantity"
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
                            d="M20 12H4"
                          />
                        </svg>
                      </button>

                      <span className="flex h-10 w-10 items-center justify-center text-sm font-semibold text-text-primary">
                        {quantity}
                      </span>

                      <button
                        onClick={() =>
                          onUpdateQuantity(product.id, quantity + 1)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-r-md text-text-primary transition-colors hover:bg-hover-bg hover:text-brand"
                        title="Increase quantity"
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className="flex h-10 items-center justify-center gap-2 px-4 text-text-primary transition-colors hover:text-brand"
                      title="Add to cart"
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
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-sm font-medium">Add to Cart</span>
                    </button>
                  )}
                </div>
              )
            ) : (
              <button
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-badge-bg px-4 py-2.5 text-sm font-semibold text-text-muted"
              >
                Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
