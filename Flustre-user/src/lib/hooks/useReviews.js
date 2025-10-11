import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchProductReviews, submitReview } from "../services/reviewService";

export function useProductReviews(productId, options = {}) {
  const queryKey = useMemo(() => ["product-reviews", productId], [productId]);
  const query = useQuery({
    queryKey,
    queryFn: () => fetchProductReviews(productId),
    enabled: Boolean(productId),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    ...options,
  });
  return query;
}

export function useSubmitReview(productId, options = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ rating, review, files }) =>
      submitReview({ productId, rating, review, files }),
    onSuccess: (data, variables, context) => {
      qc.invalidateQueries({ queryKey: ["product-reviews", productId] });
      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
    ...options,
  });
}
