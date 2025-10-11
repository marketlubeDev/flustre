import { useQuery } from "@tanstack/react-query";
import {
  getBanners,
  getProductBanners,
  getFeaturedPromotionBanners,
  getHeroBanners,
} from "../api/bannerApi";

export function useBanners(bannerFor = null, options = {}) {
  return useQuery({
    queryKey: ["banners", bannerFor],
    queryFn: () => getBanners(bannerFor),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
}

export function useProductBanners(options = {}) {
  return useQuery({
    queryKey: ["banners", "product"],
    queryFn: getProductBanners,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
}

export function useFeaturedPromotionBanners(options = {}) {
  return useQuery({
    queryKey: ["banners", "singleOffer"],
    queryFn: getFeaturedPromotionBanners,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
}

export function useHeroBanners(options = {}) {
  return useQuery({
    queryKey: ["banners", "hero"],
    queryFn: getHeroBanners,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    ...options,
  });
}
