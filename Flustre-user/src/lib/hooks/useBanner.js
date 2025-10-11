import { useEffect, useState } from "react";
import {
  fetchAllBanners,
  fetchBannersByType,
} from "@/lib/services/bannerService";

export default function useBanner(options = {}) {
  const { bannerFor } = options;

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function load() {
      try {
        let apiResponse;

        if (bannerFor) {
          // If bannerFor is specified, fetch banners by type
          apiResponse = await fetchBannersByType(bannerFor, controller.signal);
        } else {
          // Fetch all banners
          apiResponse = await fetchAllBanners(controller.signal);
        }

        const items = Array.isArray(apiResponse?.data) ? apiResponse.data : [];

        const normalized = items.map((item, index) => {
          const categoryName = item?.category?.name;
          return {
            id: item?._id || item?.id || `banner-${index}`,
            image: item?.image || "",
            mobileImage: item?.mobileImage || item?.image || "",
            title: categoryName || item?.title || "",
            subtitle: item?.category?.description || "",
            description:
              item?.description ||
              (item?.percentage ? `${item.percentage}% off` : ""),
            bannerFor: item.bannerFor || "",
          };
        });

        setBanners(normalized);
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
  }, [bannerFor]);

  return { banners, loading, error };
}
