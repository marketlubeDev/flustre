import { useMemo, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import {
  addToWishlistApi,
  removeFromWishlistApi,
  getWishlistApi,
  clearWishlistApi,
  syncWishlistApi,
  checkWishlistStatusApi,
} from "../services/wishlistService";
import { toast } from "sonner";

const WISHLIST_QUERY_KEY = ["wishlist"];
const WISHLIST_LOCAL_STORAGE_KEY = "wishlist_items";

/**
 * Get wishlist items from localStorage
 */
function getLocalWishlistItems() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save wishlist items to localStorage
 */
function saveLocalWishlistItems(items) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(WISHLIST_LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save wishlist to localStorage:", error);
  }
}

/**
 * Normalize product ID (handle variant IDs like "productId_variantId")
 */
function normalizeId(id) {
  if (!id) return id;
  return String(id).split("_")[0];
}

/**
 * Create a consistent key for wishlist item identification
 */
function getWishlistItemKey(productId, variantId) {
  return variantId ? `${productId}_${variantId}` : String(productId);
}

/**
 * Main hook for wishlist operations
 */
export function useWishlist(options = {}) {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useSelector((state) => state.user);
  const hasSyncedOnLoginRef = useRef(false);

  // Fetch wishlist from server (only when logged in)
  const wishlistQuery = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: getWishlistApi,
    enabled: isLoggedIn,
    staleTime: 60_000, // 1 minute
    gcTime: 5 * 60_000, // 5 minutes
    select: (data) => data?.data || null,
    ...options,
  });

  // Get local wishlist items (for guest users)
  const localItems = useMemo(() => {
    if (isLoggedIn) return [];
    return getLocalWishlistItems();
  }, [isLoggedIn]);

  // Add item to wishlist
  const addMutation = useMutation({
    mutationFn: ({ productId, variantId }) =>
      addToWishlistApi({ productId, variantId }),
    onSuccess: (response) => {
      // Extract the data from the response: { success, message, data: {...} }
      const wishlistData = response?.data || response;
      queryClient.setQueryData(WISHLIST_QUERY_KEY, wishlistData);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success("Added to wishlist");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to add to wishlist";
      toast.error(message);
    },
  });

  // Remove item from wishlist
  const removeMutation = useMutation({
    mutationFn: ({ productId, variantId }) =>
      removeFromWishlistApi({ productId, variantId }),
    onSuccess: (response) => {
      // Extract the data from the response: { success, message, data: {...} }
      const wishlistData = response?.data || response;
      queryClient.setQueryData(WISHLIST_QUERY_KEY, wishlistData);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success("Removed from wishlist");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to remove from wishlist";
      toast.error(message);
    },
  });

  // Clear wishlist
  const clearMutation = useMutation({
    mutationFn: clearWishlistApi,
    onSuccess: (response) => {
      // Extract the data from the response: { success, message, data: {...} }
      const wishlistData = response?.data || response;
      queryClient.setQueryData(WISHLIST_QUERY_KEY, wishlistData);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      toast.success("Wishlist cleared");
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || "Failed to clear wishlist";
      toast.error(message);
    },
  });

  // Sync wishlist from localStorage
  const syncMutation = useMutation({
    mutationFn: syncWishlistApi,
    onSuccess: (response) => {
      // Extract the data from the response: { success, message, data: {...} }
      const wishlistData = response?.data || response;
      queryClient.setQueryData(WISHLIST_QUERY_KEY, wishlistData);
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
      // Clear localStorage after successful sync
      if (typeof window !== "undefined") {
        localStorage.removeItem(WISHLIST_LOCAL_STORAGE_KEY);
      }
    },
    onError: (error) => {
      console.error("Failed to sync wishlist:", error);
    },
  });

  // Toggle item in wishlist (add if not present, remove if present)
  const toggleItem = async (productId, variantId = null) => {
    // For logged-in users: ONLY use API (never localStorage)
    if (isLoggedIn) {
      console.log("Toggling wishlist via API:", { productId, variantId, isLoggedIn });
      // Check if item exists in server data
      const wishlist = wishlistQuery.data || queryClient.getQueryData(WISHLIST_QUERY_KEY);
      const items = wishlist?.items || [];
      const key = getWishlistItemKey(productId, variantId);
      const exists = items.some((item) => {
        const itemProductId = item.product?._id || item.product;
        const itemVariantId = item.variant?._id || item.variant;
        return getWishlistItemKey(itemProductId, itemVariantId) === key;
      });

      if (exists) {
        console.log("Item exists, removing from wishlist");
        removeMutation.mutate({ productId, variantId });
      } else {
        console.log("Item doesn't exist, adding to wishlist");
        addMutation.mutate({ productId, variantId });
      }
      return;
    }

    // For guest users: use localStorage
    const items = getLocalWishlistItems();
    const key = getWishlistItemKey(productId, variantId);
    const existingIndex = items.findIndex(
      (item) => getWishlistItemKey(item.productId || item.id, item.variantId) === key
    );

    if (existingIndex >= 0) {
      // Remove from local storage
      items.splice(existingIndex, 1);
      saveLocalWishlistItems(items);
      toast.success("Removed from wishlist");
    } else {
      // Add to local storage
      items.push({
        productId: normalizeId(productId),
        variantId: variantId || undefined,
        id: key,
      });
      saveLocalWishlistItems(items);
      toast.success("Added to wishlist");
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId, variantId = null) => {
    // For logged-in users: ONLY check server data (never localStorage)
    if (isLoggedIn) {
      const wishlist = wishlistQuery.data || queryClient.getQueryData(WISHLIST_QUERY_KEY);
      const items = wishlist?.items || [];
      const key = getWishlistItemKey(productId, variantId);
      return items.some((item) => {
        const itemProductId = item.product?._id || item.product;
        const itemVariantId = item.variant?._id || item.variant;
        return getWishlistItemKey(itemProductId, itemVariantId) === key;
      });
    }

    // For guest users: check localStorage
    const items = getLocalWishlistItems();
    const key = getWishlistItemKey(productId, variantId);
    return items.some(
      (item) => getWishlistItemKey(item.productId || item.id, item.variantId) === key
    );
  };

  // Add item to wishlist
  const addItem = (productId, variantId = null) => {
    // For logged-in users: ONLY use API (never localStorage)
    if (isLoggedIn) {
      console.log("Adding to wishlist via API:", { productId, variantId, isLoggedIn });
      addMutation.mutate({ productId, variantId });
      return;
    }

    // For guest users: use localStorage
    const items = getLocalWishlistItems();
    const key = getWishlistItemKey(productId, variantId);
    const exists = items.some(
      (item) => getWishlistItemKey(item.productId || item.id, item.variantId) === key
    );

    if (!exists) {
      items.push({
        productId: normalizeId(productId),
        variantId: variantId || undefined,
        id: key,
      });
      saveLocalWishlistItems(items);
      toast.success("Added to wishlist");
    } else {
      toast.info("Item already in wishlist");
    }
  };

  // Remove item from wishlist
  const removeItem = (productId, variantId = null) => {
    // For logged-in users: ONLY use API (never localStorage)
    if (isLoggedIn) {
      removeMutation.mutate({ productId, variantId });
      return;
    }

    // For guest users: use localStorage
    const items = getLocalWishlistItems();
    const key = getWishlistItemKey(productId, variantId);
    const filtered = items.filter(
      (item) => getWishlistItemKey(item.productId || item.id, item.variantId) !== key
    );
    saveLocalWishlistItems(filtered);
    toast.success("Removed from wishlist");
  };

  // Sync localStorage wishlist to server when user logs in, then clear localStorage
  useEffect(() => {
    const syncGuestWishlistToServer = async () => {
      if (!isLoggedIn || hasSyncedOnLoginRef.current) return;
      hasSyncedOnLoginRef.current = true;

      if (typeof window === "undefined") return;

      try {
        const localItems = getLocalWishlistItems();
        if (!Array.isArray(localItems) || localItems.length === 0) {
          // No local items, just fetch from server and clear localStorage
          await queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
          localStorage.removeItem(WISHLIST_LOCAL_STORAGE_KEY);
          return;
        }

        // Convert local items to sync format
        const itemsToSync = localItems.map((item) => ({
          productId: item.productId || normalizeId(item.id),
          variantId: item.variantId || undefined,
        }));

        // Sync to server (this will clear localStorage in the mutation's onSuccess)
        await syncMutation.mutateAsync(itemsToSync);
      } catch (error) {
        console.error("Failed to sync guest wishlist to server:", error);
        hasSyncedOnLoginRef.current = false; // Reset on error to retry
      }
    };

    syncGuestWishlistToServer();
  }, [isLoggedIn, queryClient, syncMutation]);

  // Clear localStorage when user logs out (cleanup)
  useEffect(() => {
    if (!isLoggedIn && typeof window !== "undefined") {
      // When logged out, we can use localStorage again
      // Reset sync flag when logged out
      hasSyncedOnLoginRef.current = false;
    }
  }, [isLoggedIn]);

  // Get current wishlist items
  const wishlistItems = useMemo(() => {
    if (!isLoggedIn) {
      return localItems;
    }

    // Use the query data directly to ensure reactivity
    const wishlist = wishlistQuery.data || queryClient.getQueryData(WISHLIST_QUERY_KEY);
    return wishlist?.items || [];
  }, [isLoggedIn, localItems, wishlistQuery.data, queryClient]);

  // Get total items count
  const totalItems = useMemo(() => {
    if (!isLoggedIn) {
      return localItems.length;
    }

    // Use the query data directly to ensure reactivity
    const wishlist = wishlistQuery.data || queryClient.getQueryData(WISHLIST_QUERY_KEY);
    return wishlist?.totalItems || wishlist?.items?.length || 0;
  }, [isLoggedIn, localItems, wishlistQuery.data, queryClient]);

  // Helper function that accepts a product object (for backward compatibility)
  const toggleWishlistItem = (product) => {
    // Extract productId and variantId from product object
    const productId = product?.id || product?._id;
    const variantId = product?.variantId || 
                     product?.selectedVariantId || 
                     (product?.variants?.[0]?._id || product?.variants?.[0]?.id) || 
                     null;
    
    if (!productId) {
      console.error("Product ID is required for wishlist toggle", product);
      return;
    }
    
    console.log("toggleWishlistItem called:", { productId, variantId, isLoggedIn, product });
    toggleItem(productId, variantId);
  };

  return {
    // Data
    wishlist: wishlistQuery.data,
    wishlistItems,
    totalItems,
    isLoading: wishlistQuery.isLoading,
    isFetching: wishlistQuery.isFetching,
    error: wishlistQuery.error,

    // Mutations
    addItem,
    removeItem,
    toggleItem,
    toggleWishlistItem, // Alias that accepts product object
    clearWishlist: () => {
      // For logged-in users: ONLY use API (never localStorage)
      if (isLoggedIn) {
        clearMutation.mutate();
        return;
      }
      // For guest users: use localStorage
      saveLocalWishlistItems([]);
      toast.success("Wishlist cleared");
    },

    // Status check
    isInWishlist,

    // Manual sync
    syncWishlist: (items) => {
      if (!isLoggedIn) return;
      syncMutation.mutate(items);
    },

    // Mutation states
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
    isClearing: clearMutation.isPending,
    isSyncing: syncMutation.isPending,

    // Refetch
    refetch: wishlistQuery.refetch,
  };
}

/**
 * Hook to check if a specific product is in wishlist
 */
export function useWishlistStatus(productId, variantId = null, options = {}) {
  const { isLoggedIn } = useSelector((state) => state.user);

  const query = useQuery({
    queryKey: ["wishlist-status", productId, variantId],
    queryFn: () => checkWishlistStatusApi({ productId, variantId }),
    enabled: Boolean(isLoggedIn && productId),
    staleTime: 30_000, // 30 seconds
    gcTime: 2 * 60_000, // 2 minutes
    select: (data) => data?.isInWishlist || false,
    ...options,
  });

  return {
    isInWishlist: query.data || false,
    isLoading: query.isLoading,
    error: query.error,
  };
}

