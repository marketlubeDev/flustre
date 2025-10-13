"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useWishlist } from "../_components/context/WishlistContext";
import Image from "next/image";
import { FaHeart } from "react-icons/fa6";

const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Newest",
  "Popular",
];

function WishlistCard({ product, onRemove }) {
  const router = useRouter();

  const handleCardClick = () => {
    // Extract original product ID (remove _index suffix if present)
    const rawId = product && product.id != null ? String(product.id) : "";
    const originalId = rawId.includes("_") ? rawId.split("_")[0] : rawId;
    if (!originalId) return;
    router.push(`/products/${originalId}`);
  };

  return (
    <div
      className="group bg-white rounded-lg overflow-hidden transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="relative h-32 sm:h-36 md:h-40 lg:h-44 flex items-center justify-center overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x300?text=Product+Image";
            }}
            unoptimized={product.image?.includes("amazonaws.com")}
          />
        </div>
        {/* Heart overlay */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(product.id);
          }}
          aria-label="Remove from wishlist"
          className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 sm:p-2 hover:scale-105 transition-transform cursor-pointer"
        >
          <FaHeart className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
        </button>
      </div>
      <div className="p-2">
        <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[10px] text-gray-600 mb-2">{product.type}</p>
        <div className="flex items-center gap-2 whitespace-nowrap">
          <span
            className="font-bold tracking-tight text-xs sm:text-sm md:text-base lg:text-base"
            style={{ color: "var(--color-primary)" }}
          >
            <span className="align-baseline text-[9px] md:text-[10px] lg:text-xs">
              ₹
            </span>
            <span className="ml-1">
              {(product.price ?? 0).toLocaleString()}
            </span>
          </span>
          {product.originalPrice ? (
            <span className="text-gray-500 tracking-tight line-through decoration-from-font decoration-gray-400 leading-none text-[10px] sm:text-xs md:text-sm lg:text-sm">
              ₹ {(product.originalPrice ?? 0).toLocaleString()}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const [sortBy, setSortBy] = useState("Featured");
  const { items, remove } = useWishlist();

  const products = useMemo(() => {
    const list = [...items];
    if (sortBy === "Price: Low to High")
      return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sortBy === "Price: High to Low")
      return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return list; // Featured/Newest/Popular fall back to stored order
  }, [items, sortBy]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-white mx-auto w-full max-w-screen-xl px-4 md:px-10 py-6 flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-800">
              Wishlist
            </h1>
          </div>

          <div className="flex items-center gap-1 relative">
            <span className="text-sm text-gray-600">
              Sort by:
            </span>
            <div
              className="relative flex items-center"
              style={{ marginRight: "12px" }}
            >
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-0 pr-6 py-0 text-sm bg-white appearance-none focus:outline-none font-semibold text-gray-800"
                style={{
                  border: "none",
                  boxShadow: "none",
                  outline: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  appearance: "none",
                  paddingLeft: "0rem",
                  paddingRight: "1.5rem",
                  height: "24px",
                  lineHeight: "24px",
                  minWidth: "80px",
                  cursor: "pointer",
                }}
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option} className="font-normal">
                    {option}
                  </option>
                ))}
              </select>
              <Image
                src="/dropdownicon.svg"
                alt="dropdown"
                width={12}
                height={12}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none"
                style={{ minWidth: "12px", minHeight: "12px" }}
              />
            </div>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-gray-600 py-16">
            Your wishlist is empty
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {products.map((product) => (
              <WishlistCard
                key={product.id}
                product={product}
                onRemove={remove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
