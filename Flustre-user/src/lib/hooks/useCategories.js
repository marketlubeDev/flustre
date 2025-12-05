import { useEffect, useState } from "react";
import { fetchAllCategories } from "@/lib/services/categoryService";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function load() {
      try {
        const apiResponse = await fetchAllCategories(controller.signal);

        // Extract categories from the API response
        // Based on the server response structure: { success: true, envelop: { data: [...] } }
        const items = Array.isArray(apiResponse?.envelop?.data)
          ? apiResponse.envelop.data
          : [];

        // Normalize the data to match the expected format
        const normalized = items.map((item, index) => ({
          id: item?._id || item?.id || `category-${index}`,
          name: item?.name || "",
          image: item?.image || "",
          description: item?.description || "",
          subcategories: Array.isArray(item?.subcategories) ? item.subcategories : [],
        }));

        setCategories(normalized);
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
  }, []);

  return { categories, loading, error };
}
