import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Keifi - Performance Products",
  description:
    "Premium performance and pharma-related products for responsible use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${inter.variable} min-h-screen bg-white font-sans text-neutral-900 antialiased transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
