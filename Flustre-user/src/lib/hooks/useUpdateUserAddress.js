import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAddress } from "../services/reviewService";

export function useUpdateUserAddress(options = {}) {
    const qc = useQueryClient();
    return useMutation({
    mutationFn: (payload) => updateUserAddress(payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["user"] });
    },
    ...options,
  });
}