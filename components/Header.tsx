"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeProvider";
import { useSettings } from "@/contexts/SettingsContext";

const brandNavOptions = [
  { label: "Both", value: "ALL" },
  { label: "Keifi", value: "KEIFI" },
  { label: "Syrocs", value: "SYROCS" },
];

export default function Header() {
  const { settings } = useSettings();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeBrand = searchParams.get("brand") ?? "ALL";

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-card-bg/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-text-primary transition-colors hover:text-text-muted"
        >
          Ghost Catalogue
        </Link>

        <div className="hidden items-center gap-2 rounded-full border border-border bg-background p-1 md:flex">
          {brandNavOptions.map((option) => {
            const isActive = pathname === "/" && activeBrand === option.value;
            const href =
              option.value === "ALL" ? "/" : `/?brand=${option.value}`;

            return (
              <Link
                key={option.value}
                href={href}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {option.label}
              </Link>
            );
          })}
        </div>

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
