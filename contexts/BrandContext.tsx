"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useCallback,
} from "react";
import { BRAND_LABELS, ProductBrand } from "@/data/products";

export type BrandFilter = ProductBrand | "ALL";

export const BRAND_NAV_OPTIONS: { label: string; value: BrandFilter }[] = [
  { label: "Both", value: "ALL" },
  { label: BRAND_LABELS.KEIFI, value: "KEIFI" },
  { label: BRAND_LABELS.SYROCS, value: "SYROCS" },
];

interface BrandContextValue {
  selectedBrand: BrandFilter;
  setSelectedBrand: (brand: BrandFilter) => void;
}

const BrandContext = createContext<BrandContextValue>({
  selectedBrand: "ALL",
  setSelectedBrand: () => {},
});

export function BrandProvider({ children }: { children: ReactNode }) {
  const [selectedBrand, setSelectedBrandRaw] = useState<BrandFilter>("ALL");

  const setSelectedBrand = useCallback((brand: BrandFilter) => {
    setSelectedBrandRaw(brand);
  }, []);

  return (
    <BrandContext.Provider value={{ selectedBrand, setSelectedBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
