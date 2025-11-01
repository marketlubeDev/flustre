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
    mutationFn: async ({ couponId, cartItems }) => {
      // Ensure we have cart items
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error("Cart is empty");
      }
      // Check if user is logged in
      const isLoggedIn = typeof window !== "undefined" && (
        !!window.localStorage?.getItem("token") ||
        !!window.localStorage?.getItem("userToken")
      );

      // Helper function to calculate coupon locally
      const calculateCouponLocally = async () => {
        // Get coupon details
        const allCoupons = await getAllCoupons();
        const coupon = allCoupons.find(c => String(c._id) === String(couponId));

        if (!coupon) {
          throw new Error("Coupon not found");
        }

        if (!Array.isArray(cartItems) || cartItems.length === 0) {
          throw new Error("Cart is empty");
        }

        // Calculate base amount based on applyTo type
        let baseAmount = 0;

        // Calculate full subtotal first
        const subtotal = cartItems.reduce(
          (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
          0
        );

        // Determine base amount based on applyTo type
        if (coupon.applyTo === "product") {
          // Only calculate discount for items matching productIds
          if (Array.isArray(coupon.productIds) && coupon.productIds.length > 0) {
            baseAmount = cartItems
              .filter(item => coupon.productIds.some(
                pid => String(pid) === String(item.productId || item.id)
              ))
              .reduce(
                (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
                0
              );
          } else {
            baseAmount = 0;
          }
        } else if (coupon.applyTo === "category") {
          // Only calculate discount for items in the category
          if (coupon.categoryId) {
            baseAmount = cartItems
              .filter(item => {
                const itemCategoryId = item.categoryId ||
                  (typeof item.category === 'object' ? item.category?._id || item.category?.id : null);
                return itemCategoryId && String(coupon.categoryId) === String(itemCategoryId);
              })
              .reduce(
                (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
                0
              );
          } else {
            baseAmount = 0;
          }
        } else if (coupon.applyTo === "subcategory") {
          // Only calculate discount for items in the subcategory
          if (coupon.categoryId) {
            baseAmount = cartItems
              .filter(item => {
                const itemSubcategoryId = item.subcategoryId ||
                  (typeof item.subcategory === 'object' ? item.subcategory?._id || item.subcategory?.id : null);
                return itemSubcategoryId && String(coupon.categoryId) === String(itemSubcategoryId);
              })
              .reduce(
                (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
                0
              );
          } else {
            baseAmount = 0;
          }
        } else if (coupon.applyTo === "above price") {
          // Check minimum purchase requirement
          if (coupon.minPurchase && subtotal < coupon.minPurchase) {
            throw new Error(`Minimum purchase of ₹${coupon.minPurchase} required`);
          }
          // For "above price", apply to entire cart
          baseAmount = subtotal;
        } else {
          // Default: apply to entire cart
          baseAmount = subtotal;
        }

        // Calculate discount based on coupon type
        let discountAmount = 0;
        if (coupon.discountType === "percentage") {
          discountAmount = Math.floor((baseAmount * coupon.discountAmount) / 100);
          if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
            discountAmount = coupon.maxDiscount;
          }
        } else {
          // Fixed/flat discount
          discountAmount = Math.min(coupon.discountAmount, baseAmount);
        }

        // Store coupon details locally
        const couponDetails = {
          couponId: coupon._id,
          code: coupon.code,
          discountAmount,
          discountType: coupon.discountType,
          applyTo: coupon.applyTo,
        };

        if (typeof window !== "undefined") {
          window.localStorage.setItem("cartCoupon", JSON.stringify(couponDetails));
          window.dispatchEvent(new Event("coupon-updated"));
          window.dispatchEvent(new Event("cart-updated"));
        }

        return {
          data: {
            status: "success",
            formattedCart: {
              couponDetails,
            },
          },
        };
      };

      // For logged-in users, try API first, fall back to local calculation if cart doesn't exist
      if (isLoggedIn) {
        try {
          const res = await applyCouponById(couponId, null);
          const details = res?.data?.formattedCart?.couponDetails;

          // If API returns discountAmount as 0, but coupon should apply, recalculate locally
          if (details && Number(details.discountAmount || 0) === 0 && Array.isArray(cartItems) && cartItems.length > 0) {
            // Recalculate locally to get the correct discount
            const localResult = await calculateCouponLocally();
            const localDetails = localResult?.data?.formattedCart?.couponDetails;

            // Calculate subtotal once for reuse
            const subtotal = cartItems.reduce(
              (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
              0
            );

            // If local calculation gives a non-zero discount, use that instead
            if (localDetails && Number(localDetails.discountAmount || 0) > 0) {
              const originalAmount = details.originalAmount || subtotal;
              const discountAmount = localDetails.discountAmount;
              const finalAmount = originalAmount - discountAmount;

              const mergedDetails = {
                ...details,
                discountAmount,
                originalAmount,
                finalAmount,
                savings: discountAmount,
              };

              if (typeof window !== "undefined") {
                window.localStorage.setItem("cartCoupon", JSON.stringify(mergedDetails));
                window.dispatchEvent(new Event("coupon-updated"));
                window.dispatchEvent(new Event("cart-updated"));
              }

              return {
                ...res,
                data: {
                  ...res.data,
                  formattedCart: {
                    ...res.data.formattedCart,
                    couponDetails: mergedDetails,
                  },
                  finalAmount,
                },
              };
            } else {
              // Local calculation also gave 0, use API response
              if (typeof window !== "undefined") {
                window.localStorage.setItem("cartCoupon", JSON.stringify(details));
                window.dispatchEvent(new Event("coupon-updated"));
                window.dispatchEvent(new Event("cart-updated"));
              }
              return res;
            }
          } else if (details && typeof window !== "undefined") {
            // API returned non-zero discount or no cart items, use API response
            window.localStorage.setItem("cartCoupon", JSON.stringify(details));
            window.dispatchEvent(new Event("coupon-updated"));
            window.dispatchEvent(new Event("cart-updated"));
          }
          return res;
        } catch (apiError) {
          // If error is "Cart not found or empty", fall back to local calculation silently
          const errorMessage = apiError?.response?.data?.message || apiError?.message || "";
          const isCartNotFoundError =
            errorMessage.includes("Cart not found") ||
            errorMessage.includes("Cart is empty") ||
            apiError?.response?.status === 404;

          if (isCartNotFoundError) {
            // Silently fall back to local calculation - don't show error to user
            // This happens when user has items in localStorage but not on server
            // Return success response - this will trigger onSuccess, not onError
            return await calculateCouponLocally();
          }
          // Otherwise, re-throw the error
          throw apiError;
        }
      } else {
        // For non-logged-in users, calculate locally
        return await calculateCouponLocally();
      }
    },
  });

  return mutation;
}
