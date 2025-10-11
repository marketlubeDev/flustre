import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllCoupons,
  searchCoupons,
  applyCouponById,
} from "../services/couponService";

export function useCoupons(searchTerm) {
  const queryKey = useMemo(
    () => ["coupons", (searchTerm || "").trim()],
    [searchTerm]
  );

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const q = (searchTerm || "").trim();
      const list = q ? await searchCoupons(q) : await getAllCoupons();
      const now = Date.now();
      return (list || []).filter(
        (c) => c?.isActive && new Date(c?.expiryDate).getTime() > now
      );
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    keepPreviousData: true,
  });

  return query;
}

export function useApplyCoupon() {
  const mutation = useMutation({
    mutationFn: async (couponId) => {
      const res = await applyCouponById(couponId);
      const details = res?.data?.formattedCart?.couponDetails;
      if (details && typeof window !== "undefined") {
        window.localStorage.setItem("cartCoupon", JSON.stringify(details));
        window.dispatchEvent(new Event("coupon-updated"));
        window.dispatchEvent(new Event("cart-updated"));
      }
      return res;
    },
  });

  return mutation;
}
