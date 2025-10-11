import { useEffect, useState } from "react";
import { fetchProducts, searchProducts } from "@/lib/services/productService";

export default function useProducts(options = {}) {
  const {
    page = 1,
    limit = 12,
    categoryId,
    subcategoryId,
    minPrice,
    maxPrice,
    sort,
    search,
    labelId,
    activeStatus,
  } = options;

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: page,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function load() {
      try {
        let data;
        if (search && String(search).trim().length > 0) {
          data = await searchProducts(
            { keyword: search, page, limit },
            controller.signal
          );
        } else {
          data = await fetchProducts(
            {
              page,
              limit,
              categoryId,
              subcategoryId,
              minPrice,
              maxPrice,
              sort,
              labelId,
              activeStatus,
            },
            controller.signal
          );
        }

        // listProducts format: { success: true, data: { products, totalProducts, totalPages, currentPage } }
        const listEnvelope = data?.data;
        const items = Array.isArray(listEnvelope?.products)
          ? listEnvelope.products
          : Array.isArray(data)
          ? data
          : [];
        const total = listEnvelope?.totalProducts || items.length || 0;
        const totalPages = listEnvelope?.totalPages || 1;
        const currentPage = listEnvelope?.currentPage || page;

        const normalized = items.map((item) => {
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

          return {
            id: item?._id || item?.id,
            name: item?.name || "",
            price,
            originalPrice,
            image,
            category: item?.category?.name || "",
            label: item?.label?.name || "",
            // Include additional fields for product cards
            variants: item?.variants || [],
            stockStatus: item?.stockStatus || "instock",
            averageRating: item?.averageRating || 0,
            totalRatings: item?.totalRatings || 0,
          };
        });

        setProducts(normalized);
        setPagination({ total, totalPages, currentPage });
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
  }, [
    page,
    limit,
    categoryId,
    subcategoryId,
    minPrice,
    maxPrice,
    sort,
    search,
    labelId,
    activeStatus,
  ]);

  return { products, loading, error, pagination };
}
