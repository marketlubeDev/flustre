"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);

  // Helper to normalize price fields to numbers (strip 'AED' and commas)
  const sanitizePrice = (value) => {
    if (value == null) return value;
    if (typeof value === "number") return value;
    const numeric = parseInt(String(value).replace(/AED\s*|,/g, ""), 10);
    return Number.isNaN(numeric) ? Number(value) || 0 : numeric;
  };

  const normalizeId = (val) => String(val).split('_')[0];

  const normalizeProduct = (product) => {
    if (!product) return product;
    return {
      ...product,
      id: normalizeId(product.id),
      price: sanitizePrice(product.price),
      originalPrice: sanitizePrice(product.originalPrice),
    };
  };

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("wishlist_items");
      if (raw) {
        const parsed = JSON.parse(raw) || [];
        const normalized = Array.isArray(parsed) ? parsed.map(normalizeProduct) : [];
        setItems(normalized);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("wishlist_items", JSON.stringify(items));
    } catch {}
  }, [items]);

  const api = useMemo(
    () => ({
      items,
      toggleWishlistItem: (product) => {
        const normalizedId = normalizeId(product.id);
        setItems((prev) => {
          const exists = prev.some((p) => normalizeId(p.id) === normalizedId);
          if (exists) {
            return prev.filter((p) => normalizeId(p.id) !== normalizedId);
          }
          return [{ ...normalizeProduct(product), id: normalizedId }, ...prev];
        });
      },
      isInWishlist: (id) => {
        const normalized = normalizeId(id);
        return items.some((p) => normalizeId(p.id) === normalized);
      },
      remove: (id) => {
        const normalized = normalizeId(id);
        setItems((prev) => prev.filter((p) => normalizeId(p.id) !== normalized));
      },
      clear: () => setItems([]),
    }),
    [items]
  );

  return <WishlistContext.Provider value={api}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
} 