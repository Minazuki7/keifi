"use client";

import { useState, useEffect } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Product, ProductCategory } from "@/data/products";
import Link from "next/link";

const categories: ProductCategory[] = [
  "INJECTABLES",
  "PEPTIDES",
  "ORALS",
  "SARMS",
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem("keifi-admin-auth") === "true";
    setIsAuthenticated(auth);
    setIsLoading(false);
  }, []);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
        sessionStorage.setItem("keifi-admin-auth", "true");
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("keifi-admin-auth");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card-bg p-8 shadow-xl">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-brand">Keifi Admin</h1>
              <p className="mt-2 text-sm text-text-muted">
                Enter password to access dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary placeholder-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-center text-sm text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-text-muted hover:text-brand"
              >
                ← Back to store
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const {
    products,
    updateProduct,
    addProduct,
    deleteProduct,
    resetToDefaults,
  } = useProducts();
  const { settings, updateSettings } = useSettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<ProductCategory | "ALL">(
    "ALL",
  );
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.chemicalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "ALL" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.isAvailable).length;
  const outOfStockCount = totalProducts - inStockCount;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-card-bg/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-brand">Keifi Admin</h1>
            <span className="hidden rounded-full bg-badge-bg px-3 py-1 text-xs font-medium text-text-secondary sm:inline-block">
              {totalProducts} products
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSettings(true)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-brand hover:text-brand"
            >
              ⚙️ Settings
            </button>
            <Link
              href="/"
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-brand hover:text-brand"
            >
              View Store
            </Link>
            <button
              onClick={onLogout}
              className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card-bg p-5">
            <p className="text-sm font-medium text-text-muted">
              Total Products
            </p>
            <p className="mt-1 text-3xl font-bold text-text-primary">
              {totalProducts}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card-bg p-5">
            <p className="text-sm font-medium text-text-muted">In Stock</p>
            <p className="mt-1 text-3xl font-bold text-success">
              {inStockCount}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card-bg p-5">
            <p className="text-sm font-medium text-text-muted">Out of Stock</p>
            <p className="mt-1 text-3xl font-bold text-warning">
              {outOfStockCount}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 sm:max-w-xs">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-text-primary placeholder-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as ProductCategory | "ALL")
              }
              className="select-styled min-w-[180px] rounded-lg border border-border bg-background py-2 pl-4 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:border-warning hover:text-warning"
            >
              Reset All
            </button>
            <button
              onClick={() => setIsAddingNew(true)}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              + Add Product
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card-bg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-badge-bg">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Product
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted sm:table-cell">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Price
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-hover-bg"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-text-primary">
                          {product.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {product.strength} • {product.quantity}
                        </p>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <span className="rounded-full bg-badge-bg px-2 py-1 text-xs font-medium text-text-secondary">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-brand">
                        {product.priceDisplay}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          updateProduct(product.id, {
                            isAvailable: !product.isAvailable,
                          })
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                          product.isAvailable
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : "bg-warning/10 text-warning hover:bg-warning/20"
                        }`}
                      >
                        {product.isAvailable ? "In Stock" : "Out"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() =>
                            updateProduct(product.id, {
                              isAvailable: !product.isAvailable,
                            })
                          }
                          className={`rounded-lg p-2 transition-colors ${
                            product.isAvailable
                              ? "text-success hover:bg-success/10"
                              : "text-warning hover:bg-warning/10"
                          }`}
                          title={
                            product.isAvailable
                              ? "Mark as Out of Stock"
                              : "Mark as In Stock"
                          }
                        >
                          {product.isAvailable ? (
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
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
                                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                              />
                            </svg>
                          )}
                        </button>
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-hover-bg hover:text-brand"
                          title="Edit"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            if (
                              confirm(
                                `Delete "${product.name}"? This cannot be undone.`,
                              )
                            ) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="rounded-lg p-2 text-text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
                          title="Delete"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-text-muted">
              No products found matching your search.
            </div>
          )}
        </div>
      </main>

      {editingProduct && (
        <ProductEditModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={(updates) => {
            updateProduct(editingProduct.id, updates);
            setEditingProduct(null);
          }}
        />
      )}

      {isAddingNew && (
        <ProductAddModal
          onClose={() => setIsAddingNew(false)}
          onAdd={(product) => {
            addProduct(product);
            setIsAddingNew(false);
          }}
        />
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card-bg p-6">
            <h3 className="text-lg font-bold text-text-primary">
              Reset All Products?
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              This will reset all products to their default values. Any changes
              you&apos;ve made will be lost.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 rounded-lg border border-border py-2 font-medium text-text-primary transition-colors hover:bg-hover-bg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetToDefaults();
                  setShowResetConfirm(false);
                }}
                className="flex-1 rounded-lg bg-warning py-2 font-medium text-white transition-colors hover:bg-warning/90"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSave={(newSettings) => {
            updateSettings(newSettings);
            setShowSettings(false);
          }}
        />
      )}
    </div>
  );
}

function ProductEditModal({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (updates: Partial<Product>) => void;
}) {
  const [form, setForm] = useState({
    name: product.name,
    chemicalName: product.chemicalName,
    description: product.description,
    strength: product.strength,
    quantity: product.quantity,
    price: product.price,
    imageUrl: product.imageUrl || "",
    isAvailable: product.isAvailable,
    category: product.category,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      imageUrl: form.imageUrl || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-card-bg p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">Edit Product</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-hover-bg hover:text-text-primary"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as ProductCategory,
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Chemical Name
            </label>
            <input
              type="text"
              value={form.chemicalName}
              onChange={(e) =>
                setForm({ ...form, chemicalName: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Strength
              </label>
              <input
                type="text"
                value={form.strength}
                onChange={(e) => setForm({ ...form, strength: e.target.value })}
                placeholder="e.g., 250mg"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Quantity
              </label>
              <input
                type="text"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="e.g., 10ml Vial"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Price (TND)
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseInt(e.target.value) || 0 })
                }
                min="0"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm({ ...form, isAvailable: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-badge-bg peer-checked:bg-success peer-focus:ring-2 peer-focus:ring-brand/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
            </label>
            <span className="text-sm font-medium text-text-secondary">
              In Stock
            </span>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border py-3 font-medium text-text-primary transition-colors hover:bg-hover-bg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProductAddModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (product: Product) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    chemicalName: "",
    description: "",
    strength: "",
    quantity: "",
    price: 0,
    imageUrl: "",
    isAvailable: true,
    category: "INJECTABLES" as ProductCategory,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const id = `${form.category.toLowerCase().slice(0, 3)}-${Date.now()}`;

    const newProduct: Product = {
      id,
      name: form.name,
      category: form.category,
      chemicalName: form.chemicalName,
      description: form.description,
      strength: form.strength,
      quantity: form.quantity,
      price: form.price,
      priceDisplay: `${form.price} TND`,
      imageUrl: form.imageUrl || undefined,
      isAvailable: form.isAvailable,
      whatsappMessage: `Hi, I'm interested in ordering ${form.name}. Please confirm availability.`,
    };

    onAdd(newProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-card-bg p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">
            Add New Product
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-hover-bg hover:text-text-primary"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category: e.target.value as ProductCategory,
                  })
                }
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Chemical Name *
            </label>
            <input
              type="text"
              value={form.chemicalName}
              onChange={(e) =>
                setForm({ ...form, chemicalName: e.target.value })
              }
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Description *
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Strength *
              </label>
              <input
                type="text"
                value={form.strength}
                onChange={(e) => setForm({ ...form, strength: e.target.value })}
                placeholder="e.g., 250mg"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Quantity *
              </label>
              <input
                type="text"
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                placeholder="e.g., 10ml Vial"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-text-secondary">
                Price (TND) *
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: parseInt(e.target.value) || 0 })
                }
                min="0"
                className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Image URL (optional)
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-border bg-background px-4 py-2 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={form.isAvailable}
                onChange={(e) =>
                  setForm({ ...form, isAvailable: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-badge-bg peer-checked:bg-success peer-focus:ring-2 peer-focus:ring-brand/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full"></div>
            </label>
            <span className="text-sm font-medium text-text-secondary">
              In Stock
            </span>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border py-3 font-medium text-text-primary transition-colors hover:bg-hover-bg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SettingsModal({
  settings,
  onClose,
  onSave,
}: {
  settings: { whatsappPhone: string; googleFormUrl: string };
  onClose: () => void;
  onSave: (settings: { whatsappPhone: string; googleFormUrl: string }) => void;
}) {
  const [form, setForm] = useState({
    whatsappPhone: settings.whatsappPhone,
    googleFormUrl: settings.googleFormUrl,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card-bg p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">Site Settings</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-text-muted hover:bg-hover-bg hover:text-text-primary"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              WhatsApp Phone Number
            </label>
            <div className="flex items-center gap-2">
              <span className="text-text-muted">+</span>
              <input
                type="text"
                value={form.whatsappPhone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    whatsappPhone: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="216XXXXXXXX"
                className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              />
            </div>
            <p className="mt-1 text-xs text-text-muted">
              Enter without + sign (e.g., 21612345678 for Tunisia)
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-text-secondary">
              Google Form URL
            </label>
            <input
              type="url"
              value={form.googleFormUrl}
              onChange={(e) =>
                setForm({ ...form, googleFormUrl: e.target.value })
              }
              placeholder="https://forms.gle/your-form-id"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            />
            <p className="mt-1 text-xs text-text-muted">
              Paste your Google Form share link here
            </p>
          </div>

          <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
            <p className="text-sm text-text-secondary">
              <strong className="text-brand">Note:</strong> These settings are
              saved in your browser. Changes will apply immediately across the
              entire site.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border py-3 font-medium text-text-primary transition-colors hover:bg-hover-bg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-brand py-3 font-semibold text-white transition-colors hover:bg-brand-hover"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
