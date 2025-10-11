import { useQuery } from "@tanstack/react-query";
import { fetchGroupedProductsByLabel } from "../services/labelService";

function normalizeProduct(p, index) {
  // Prefer variant pricing if present
  const firstVariant =
    Array.isArray(p?.variants) && p.variants.length > 0
      ? p.variants[0]
      : undefined;
  const price =
    p?.offerPrice ??
    firstVariant?.offerPrice ??
    p?.price ??
    firstVariant?.price ??
    0;
  const originalPrice = p?.price ?? firstVariant?.price ?? price;
  const image =
    p?.image ||
    p?.mainImage ||
    p?.featureImages?.[0] ||
    p?.images?.[0] ||
    "/banner1.png";

  return {
    id: String(p?._id || p?.id || index),
    name: p?.name || "",
    category: p?.category?.name || p?.type || "",
    price,
    originalPrice,
    image,
  };
}

export function useBestSellerProducts(options = {}) {
  return useQuery({
    queryKey: ["labels", "grouped-products"],
    queryFn: async ({ signal }) => {
      const groups = await fetchGroupedProductsByLabel(signal);
      // Prefer label name match. Fallback: first group.
      const bestGroup =
        groups.find((g) =>
          (g?.label?.name || "").toLowerCase().includes("best")
        ) ||
        groups.find((g) =>
          (g?.label?.name || "").toLowerCase().includes("Sellers")
        ) ||
        groups[0];

      const products = Array.isArray(bestGroup?.products)
        ? bestGroup.products.map((p, idx) => normalizeProduct(p, idx))
        : [];

      return {
        label: bestGroup?.label,
        products,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
    ...options,
  });
}

export default useBestSellerProducts;
