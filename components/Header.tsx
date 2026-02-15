"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeProvider";
import { useSettings } from "@/contexts/SettingsContext";

export default function Header() {
  const { settings } = useSettings();

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-card-bg/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-text-primary transition-colors hover:text-text-muted"
        >
          Ghost Catalogue
        </Link>



        <div className="flex items-center gap-3 sm:gap-6">
          <ThemeToggle />
          <a
            href={`https://wa.me/${settings.whatsappPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-success-hover hover:shadow-lg hover:shadow-success/25 sm:inline-flex"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </nav>
  );
}
