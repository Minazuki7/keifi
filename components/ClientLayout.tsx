"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ProductProvider } from "@/contexts/ProductContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Header from "@/components/Header";
import { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ProductProvider>
          <Header />
          <main className="pt-16">{children}</main>
        </ProductProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
