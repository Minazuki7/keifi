"use client";

import { ProductCategory } from "@/data/products";

type CategoryTabsProps = {
  categories: ProductCategory[];
  selectedCategory: ProductCategory | "ALL";
  onSelect: (category: ProductCategory | "ALL") => void;
};

const categoryLabels: Record<ProductCategory | "ALL", string> = {
  ALL: "All",
  SARMS: "SARMs",
  INJECTABLES: "Injectables",
  PEPTIDES: "Peptides",
  ORALS: "Orals",
};

export default function CategoryTabs({
  categories,
  selectedCategory,
  onSelect,
}: CategoryTabsProps) {
  const allCategories: (ProductCategory | "ALL")[] = ["ALL", ...categories];

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {allCategories.map((category) => {
        const isSelected = selectedCategory === category;
        return (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`
              rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200
              sm:px-6 sm:py-3 sm:text-base
              ${
                isSelected
                  ? "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg"
                  : "border-2 border-border bg-card-bg text-text-primary hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-md"
              }
            `}
          >
            {categoryLabels[category]}
          </button>
        );
      })}
    </div>
  );
}
