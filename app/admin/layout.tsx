"use client";

import { ThemeProvider } from "@/components/ThemeProvider";
import { ProductProvider } from "@/contexts/ProductContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <ProductProvider>{children}</ProductProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}
