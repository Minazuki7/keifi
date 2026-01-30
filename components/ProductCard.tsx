"use client";

import { useRouter } from "next/navigation";
import { Product, ProductCategory } from "@/data/products";
import { useSettings } from "@/contexts/SettingsContext";

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
  const { settings } = useSettings();
  const { bg, text } = categoryColors[product.category];
  const isInCart = quantity > 0;

  const whatsappUrl = `https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent(
    product.whatsappMessage,
  )}`;

  const formUrl = `${settings.googleFormUrl}?productId=${encodeURIComponent(product.id)}&productName=${encodeURIComponent(product.name)}`;

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
        <div className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-md">
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
          <span className="text-2xl font-bold text-brand">
            {product.priceDisplay}
          </span>
        </div>

        <div className="mt-auto space-y-3" onClick={stopPropagation}>
          <div className="flex items-center gap-2">
            {product.isAvailable ? (
              <>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-success px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-success-hover hover:shadow-lg hover:shadow-success/25"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Order
                </a>

                {onUpdateQuantity && (
                  <div className="flex items-center rounded-lg border-2 border-border bg-transparent">
                    {isInCart ? (
                      <>
                        <button
                          onClick={() =>
                            onUpdateQuantity(product.id, quantity - 1)
                          }
                          className="flex h-10 w-9 items-center justify-center rounded-l-md text-text-primary transition-colors hover:bg-hover-bg hover:text-brand"
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

                        <span className="flex h-10 w-8 items-center justify-center text-sm font-semibold text-text-primary">
                          {quantity}
                        </span>

                        <button
                          onClick={() =>
                            onUpdateQuantity(product.id, quantity + 1)
                          }
                          className="flex h-10 w-9 items-center justify-center rounded-r-md text-text-primary transition-colors hover:bg-hover-bg hover:text-brand"
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
                        className="flex h-10 items-center justify-center gap-1 px-3 text-text-primary transition-colors hover:text-brand"
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
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <button
                disabled
                className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-badge-bg px-4 py-2.5 text-sm font-semibold text-text-muted"
              >
                Unavailable
              </button>
            )}
          </div>

          {product.isAvailable && (
            <a
              href={formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-border px-4 py-2 text-xs font-medium text-text-secondary transition-all duration-200 hover:border-brand hover:text-brand"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Order via form
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
