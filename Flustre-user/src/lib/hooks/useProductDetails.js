import { useEffect, useState } from "react";
import { fetchProductDetails } from "@/lib/services/productService";

export default function useProductDetails(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const data = await fetchProductDetails(productId, controller.signal);
        // Server returns full product document with populated fields and rating stats
        const item = data;
        const firstVariant =
          Array.isArray(item?.variants) && item.variants.length > 0
            ? item.variants[0]
            : null;

        // Use new model structure: variants have price/compareAtPrice, product has price/compareAtPrice
        const price = firstVariant?.price ?? item?.price ?? 0;
        const originalPrice =
          firstVariant?.compareAtPrice ?? item?.compareAtPrice ?? price;

        const image =
          firstVariant?.images?.[0] ||
          item?.featureImages?.[0] ||
          "/placeholder.png";

        const normalized = {
          id: item?._id || item?.id,
          name: item?.name || "",
          images: item?.featureImages || firstVariant?.images || [],
          price,
          originalPrice,
          description: item?.about || item?.description || "",
          specifications: item?.specifications || [],
          featuresSections: item?.featuresSections || [],
          category: item?.category?.name || "",
          label: item?.label?.name || "",
          ratingStats: item?.ratingStats || null,
          variants: item?.variants || [],
          primaryImage: image,
          // New fields from restructured model
          options: item?.options || [],
          returnPolicyDays: item?.returnPolicyDays || 7,
          returnPolicyText: item?.returnPolicyText || "",
          profit: item?.profit || 0,
          costPerItem: item?.costPerItem || 0,
        };

        setProduct(normalized);
      } catch (err) {
        if (err?.name !== "CanceledError" && err?.name !== "AbortError") {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [productId]);

  return { product, loading, error };
}
