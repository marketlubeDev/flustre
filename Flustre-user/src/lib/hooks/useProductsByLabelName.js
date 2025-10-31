import useProducts from "@/lib/hooks/useProducts";

export default function useProductsByLabelName(labelName, options = {}) {
  const { products, loading, error, pagination } = useProducts(options);

  const normalizedLabel = String(labelName || "").toLowerCase();
  const filtered = (products || []).filter(
    (p) => String(p?.label || "").toLowerCase() === normalizedLabel
  );

  return { products: filtered, loading, error, pagination };
}
