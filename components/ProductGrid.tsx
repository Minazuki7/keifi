"use client";

import { useState } from "react";
import { Product, ProductCategory } from "@/data/products";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  selectedCategory?: ProductCategory | "ALL";
  cartItems?: Record<string, number>;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
};

const ITEMS_PER_PAGE = 12;

function ProductGridInner({
  products,
  selectedCategory = "ALL",
  cartItems = {},
  onUpdateQuantity,
}: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const filteredProducts =
    selectedCategory === "ALL"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  if (filteredProducts.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-border bg-card-bg/50">
        <p className="text-text-muted">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            quantity={cartItems[product.id] || 0}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center gap-4 sm:mt-12">
          <p className="text-sm text-text-secondary">
            Showing{" "}
            <span className="font-semibold text-text-primary">
              {currentPage * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold text-text-primary">
              {Math.min(
                (currentPage + 1) * ITEMS_PER_PAGE,
                filteredProducts.length,
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-text-primary">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-border bg-card-bg text-text-primary shadow-sm transition-all hover:border-brand hover:bg-hover-bg hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-card-bg disabled:hover:text-text-primary"
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
              {Array.from({ length: totalPages }, (_, i) => {
                const showPage =
                  i === 0 ||
                  i === totalPages - 1 ||
                  Math.abs(i - currentPage) <= 1;

                const showEllipsisBefore =
                  i === currentPage - 2 && currentPage > 2;
                const showEllipsisAfter =
                  i === currentPage + 2 && currentPage < totalPages - 3;

                if (showEllipsisBefore || showEllipsisAfter) {
                  return (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-2 text-text-muted"
                    >
                      ...
                    </span>
                  );
                }

                if (!showPage) return null;

                return (
                  <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                      currentPage === i
                        ? "bg-brand text-white shadow-md shadow-brand/30"
                        : "border-2 border-border bg-card-bg text-text-primary shadow-sm hover:border-brand hover:text-brand"
                    }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-border bg-card-bg text-text-primary shadow-sm transition-all hover:border-brand hover:bg-hover-bg hover:text-brand disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:bg-card-bg disabled:hover:text-text-primary"
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
        </div>
      )}
    </div>
  );
}

export default function ProductGrid(props: ProductGridProps) {
  return <ProductGridInner key={props.selectedCategory} {...props} />;
}
