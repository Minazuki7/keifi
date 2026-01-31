"use client";

import { useState } from "react";
import { Product } from "@/data/products";
import { useSettings } from "@/contexts/SettingsContext";

type CartPanelProps = {
  products: Product[];
  cartItems: Record<string, number>;
  onClearSelection: () => void;
  onRemoveItem?: (productId: string) => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
};

const ITEMS_PER_PAGE = 4;

export default function CartPanel({
  products,
  cartItems,
  onClearSelection,
  onRemoveItem,
  onUpdateQuantity,
}: CartPanelProps) {
  const { settings } = useSettings();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const selectedProducts = products.filter((p) => cartItems[p.id] > 0);

  const uniqueItemCount = selectedProducts.length;

  const totalItemCount = Object.values(cartItems).reduce(
    (sum, qty) => sum + qty,
    0,
  );

  const total = selectedProducts.reduce(
    (sum, p) => sum + p.price * (cartItems[p.id] || 0),
    0,
  );

  const totalPages = Math.ceil(uniqueItemCount / ITEMS_PER_PAGE);
  const paginatedProducts = selectedProducts.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const buildWhatsAppMessage = (): string => {
    const lines = [
      "Hi, I would like to order the following products:",
      "",
      ...selectedProducts.map((p) => {
        const qty = cartItems[p.id];
        const lineTotal = p.price * qty;
        return `• ${p.name} x${qty} - ${lineTotal} TND`;
      }),
      "",
      `Total: ${total} TND`,
      "",
      "Please confirm availability and delivery details.",
    ];
    return lines.join("\\n");
  };

  const whatsappUrl = `https://wa.me/${settings.whatsappPhone}?text=${encodeURIComponent(
    buildWhatsAppMessage(),
  )}`;

  if (totalItemCount === 0) return null;

  if (currentPage >= totalPages && currentPage > 0) {
    setCurrentPage(totalPages - 1);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 dark:bg-neutral-100 shadow-lg shadow-neutral-900/30 dark:shadow-neutral-100/20 transition-all duration-300 hover:scale-110 hover:shadow-xl sm:h-18 sm:w-18"
        >
          <svg
            className="h-7 w-7 text-white dark:text-neutral-900 sm:h-8 sm:w-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>

          <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-warning text-sm font-bold text-white shadow-md">
            {totalItemCount}
          </span>

          <span className="absolute -left-2 bottom-full mb-2 hidden whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-sm font-medium text-background opacity-0 shadow-lg transition-opacity group-hover:opacity-100 sm:block">
            {total} TND
            <span className="absolute left-4 top-full border-4 border-transparent border-t-foreground"></span>
          </span>
        </button>
      )}

      {isExpanded && (
        <div className="w-[calc(100vw-2rem)] max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300 sm:w-96">
          <div className="overflow-hidden rounded-2xl border border-card-border bg-card-bg shadow-2xl">
            <div className="flex items-center justify-between bg-neutral-900 dark:bg-neutral-100 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 dark:bg-black/10">
                  <svg
                    className="h-5 w-5 text-white dark:text-neutral-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white dark:text-neutral-900">
                    Your Selection
                  </h3>
                  <p className="text-sm text-white/80 dark:text-neutral-600">
                    {totalItemCount} {totalItemCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="rounded-full bg-white/20 dark:bg-black/10 p-2 text-white dark:text-neutral-900 transition-colors hover:bg-white/30 dark:hover:bg-black/20"
                title="Minimize"
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>

            <div className="divide-y divide-divider">
              {paginatedProducts.map((product) => {
                const qty = cartItems[product.id] || 0;
                const lineTotal = product.price * qty;
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-hover-bg"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-badge-bg text-sm font-bold text-text-primary">
                      {product.name.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-text-primary">
                        {product.name}
                      </p>
                      <p className="text-sm text-text-muted">
                        {product.priceDisplay} each
                      </p>
                    </div>

                    {onUpdateQuantity && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onUpdateQuantity(product.id, qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-hover-bg hover:text-text-primary"
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
                        <span className="w-6 text-center text-sm font-semibold text-text-primary">
                          {qty}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-hover-bg hover:text-text-primary"
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
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary">
                        {lineTotal} TND
                      </span>
                      {onRemoveItem && (
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="rounded-full p-1 text-text-muted transition-colors hover:bg-red-100 hover:text-red-500"
                          title="Remove"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 border-t border-divider px-4 py-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  className="rounded-lg p-1.5 text-text-primary transition-colors hover:bg-hover-bg disabled:opacity-40 disabled:hover:bg-transparent"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i)}
                      className={`h-2 w-2 rounded-full transition-all ${
                        currentPage === i
                          ? "w-4 bg-neutral-900 dark:bg-neutral-100"
                          : "bg-text-muted hover:bg-text-secondary"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={currentPage === totalPages - 1}
                  className="rounded-lg p-1.5 text-text-primary transition-colors hover:bg-hover-bg disabled:opacity-40 disabled:hover:bg-transparent"
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="border-t border-border bg-badge-bg px-4 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-text-secondary">
                  Total ({totalItemCount}{" "}
                  {totalItemCount === 1 ? "item" : "items"})
                </span>
                <span className="text-2xl font-bold text-text-primary">
                  {total} TND
                </span>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-success py-3.5 font-semibold text-white transition-all duration-200 hover:bg-success-hover hover:shadow-lg hover:shadow-success/25"
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

              <button
                onClick={() => {
                  onClearSelection();
                  setIsExpanded(false);
                }}
                className="mt-3 w-full text-center text-sm font-medium text-text-muted transition-colors hover:text-red-500"
              >
                Clear all items
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
