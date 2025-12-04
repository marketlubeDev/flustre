import { useState, useEffect, useRef } from "react";
import {
  checkAvailability,
  addToCartApi,
  removeFromCartApi,
} from "../services/cartService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import axiosInstance from "../axios/axiosInstance";

const useCart = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const { isLoggedIn } = useSelector((state) => state.user);
  const hasSyncedOnLoginRef = useRef(false);

  const addToCart = async (product, variantId, quantity) => {
    setIsLoading(true);
    if (!isLoggedIn) {
      try {
        const raw =
          typeof window !== "undefined"
            ? localStorage.getItem("cartItems")
            : null;
        const items = raw ? JSON.parse(raw) : [];
        // Create a consistent key for cart item identification
        const cartItemKey = variantId
          ? `${product.id}_${variantId}`
          : product.id;
        const index = items.findIndex(
          (item) => String(item.id) === String(cartItemKey)
        );

        let itemAdded = false;

        if (index >= 0) {
          const existing = items[index];
          let totalQuantity = (existing.quantity || 1) + (quantity || 1);

          // Try to check availability, but don't fail if the check fails
          try {
            const availability = await checkAvailability({
              productId: product.id,
              variantId,
              quantity: totalQuantity,
            });
            if (availability.success) {
              items[index] = {
                ...existing,
                quantity: totalQuantity,
              };
              itemAdded = true;
            } else {
              toast.error(availability.message || "Product not available in requested quantity");
            }
          } catch (availError) {
            // If availability check fails, add anyway for non-logged-in users
            console.warn("Availability check failed, adding to cart anyway:", availError);
            items[index] = {
              ...existing,
              quantity: totalQuantity,
            };
            itemAdded = true;
          }
        } else {
          // Try to check availability, but don't fail if the check fails
          try {
            const availability = await checkAvailability({
              productId: product.id,
              variantId,
              quantity: quantity || 1,
            });
            if (availability.success) {
              items.push({
                ...product,
                id: cartItemKey,
                quantity: quantity || 1,
              });
              itemAdded = true;
            } else {
              toast.error(availability.message || "Product not available");
            }
          } catch (availError) {
            // If availability check fails, add anyway for non-logged-in users
            console.warn("Availability check failed, adding to cart anyway:", availError);
            items.push({
              ...product,
              id: cartItemKey,
              quantity: quantity || 1,
            });
            itemAdded = true;
          }
        }

        if (itemAdded) {
          if (typeof window !== "undefined") {
            localStorage.setItem("cartItems", JSON.stringify(items));
            window.dispatchEvent(new Event("cart-updated"));

            if (window.__openCart) {
              window.__openCart();
            } else {
              window.dispatchEvent(new Event("open-cart"));
            }
          }

          setCartItems(items);
          toast.success("Item added to cart successfully");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to add to cart");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const response = await addToCartApi({ product, variantId, quantity });
        // Server returns formatted cart in response.data
        const formattedCart = response?.data;

        // Sync localStorage cart to reflect server cart for UI sidebar
        if (formattedCart && Array.isArray(formattedCart.items)) {
          const itemsForUi = formattedCart.items.map((it) => {
            const productId = it?.product?._id || it?.product;
            const variantId = it?.variant?._id || it?.variant;
            // Create consistent cart item key
            const id = variantId ? `${productId}_${variantId}` : productId;
            const name = it?.product?.name;
            const image =
              it?.mainImage || it?.images?.[0] || it?.product?.mainImage;
            const price =
              it?.offerPrice ||
              it?.price ||
              it?.variant?.offerPrice ||
              it?.variant?.price;
            const originalPrice = it?.price || it?.variant?.price || price;
            const qty = Number(it?.quantity) > 0 ? Number(it.quantity) : 1;
            // Get variant options from variant object
            const variantOptions = it?.variant?.options || it?.variant?.attributes || {};
            return {
              id: String(id),
              productId,
              variantId,
              name,
              image,
              price,
              originalPrice,
              quantity: qty,
              variantOptions, // Include variant options
            };
          });

          if (typeof window !== "undefined") {
            // Only update localStorage if the server cart is different from current localStorage
            const currentLocalCart = localStorage.getItem("cartItems");
            const currentItems = currentLocalCart
              ? JSON.parse(currentLocalCart)
              : [];

            // Check if the server cart is significantly different from local cart
            const isDifferent =
              JSON.stringify(itemsForUi) !== JSON.stringify(currentItems);

            if (isDifferent) {
              window.localStorage.setItem(
                "cartItems",
                JSON.stringify(itemsForUi)
              );
              window.dispatchEvent(new Event("cart-updated"));
            }

            if (window.__openCart) {
              window.__openCart();
            } else {
              window.dispatchEvent(new Event("open-cart"));
            }
          }

          setCartItems(itemsForUi);
          toast.success("Item added to cart successfully");
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to add to cart");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setIsLoading(true);

    if (!isLoggedIn) {
      try {
        const raw =
          typeof window !== "undefined"
            ? localStorage.getItem("cartItems")
            : null;
        const items = raw ? JSON.parse(raw) : [];
        const filteredItems = items.filter(
          (item) => String(item.id) !== String(itemId)
        );

        if (typeof window !== "undefined") {
          localStorage.setItem("cartItems", JSON.stringify(filteredItems));
          window.dispatchEvent(new Event("cart-updated"));
        }

        setCartItems(filteredItems);
        toast.success("Item removed from cart successfully");
      } catch (err) {
        console.error("Error removing item from cart:", err);
        toast.error("Failed to remove item from cart");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        // Find the item in the current cart to get productId and variantId
        const currentItems =
          cartItems.length > 0
            ? cartItems
            : typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("cartItems") || "[]")
            : [];

        const itemToRemove = currentItems.find(
          (item) => String(item.id) === String(itemId)
        );

        if (!itemToRemove) {
          toast.error("Item not found in cart");
          return;
        }

        const response = await removeFromCartApi({
          productId: itemToRemove.productId,
          variantId: itemToRemove.variantId,
        });
        const formattedCart = response?.data;

        if (formattedCart && Array.isArray(formattedCart.items)) {
          const itemsForUi = formattedCart.items.map((it) => {
            const id = it?.variant?._id || it?.product?._id || it?._id;
            const name = it?.product?.name;
            const image =
              it?.mainImage || it?.images?.[0] || it?.product?.mainImage;
            const price =
              it?.offerPrice ||
              it?.price ||
              it?.variant?.offerPrice ||
              it?.variant?.price;
            const originalPrice = it?.price || it?.variant?.price || price;
            const qty = Number(it?.quantity) > 0 ? Number(it.quantity) : 1;
            return {
              id: String(id),
              productId: it?.product?._id || it?.product,
              variantId: it?.variant?._id || it?.variant,
              name,
              image,
              price: Number(price) || 0,
              originalPrice: Number(originalPrice) || 0,
              quantity: qty,
            };
          });

          if (typeof window !== "undefined") {
            window.localStorage.setItem(
              "cartItems",
              JSON.stringify(itemsForUi)
            );
            window.dispatchEvent(new Event("cart-updated"));
          }

          setCartItems(itemsForUi);
          toast.success("Item removed from cart successfully");
        } else {
          // If no items in cart, clear localStorage
          if (typeof window !== "undefined") {
            window.localStorage.setItem("cartItems", JSON.stringify([]));
            window.dispatchEvent(new Event("cart-updated"));
          }
          setCartItems([]);
          toast.success("Item removed from cart successfully");
        }
      } catch (err) {
        console.error("Error removing item from cart:", err);
        toast.error(
          err?.response?.data?.message || "Failed to remove item from cart"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const syncCartFromServer = async () => {
    if (!isLoggedIn) return;

    try {
      const response = await axiosInstance.get("/cart/get-cart");
      // NOTE: get-cart responds with { success, message, data: { formattedCart, ... } }
      const formattedCart = response?.data?.data?.formattedCart;

      if (formattedCart && Array.isArray(formattedCart.items)) {
        const itemsForUi = formattedCart.items.map((it) => {
          const productId = it?.product?._id || it?.product;
          const variantId = it?.variant?._id || it?.variant;
          // Create consistent cart item key
          const id = variantId ? `${productId}_${variantId}` : productId;
          const name = it?.product?.name;
          const image =
            it?.mainImage || it?.images?.[0] || it?.product?.mainImage;
          const price =
            it?.offerPrice ||
            it?.price ||
            it?.variant?.offerPrice ||
            it?.variant?.price;
          const originalPrice = it?.price || it?.variant?.price || price;
          const qty = Number(it?.quantity) > 0 ? Number(it.quantity) : 1;
          // Get variant options from variant object
          const variantOptions = it?.variant?.options || it?.variant?.attributes || {};
          return {
            id: String(id),
            productId,
            variantId,
            name,
            image,
            price,
            originalPrice,
            quantity: qty,
            variantOptions, // Include variant options
          };
        });

        if (typeof window !== "undefined") {
          window.localStorage.setItem("cartItems", JSON.stringify(itemsForUi));
          window.dispatchEvent(new Event("cart-updated"));
        }

        setCartItems(itemsForUi);
      }
    } catch (err) {
      console.error("Failed to sync cart from server:", err);
    }
  };

  // When user logs out, clear cart state and localStorage
  useEffect(() => {
    if (!isLoggedIn) {
      hasSyncedOnLoginRef.current = false;
      // Clear cart state when logged out
      setCartItems([]);
      // Clear cart from localStorage (logged-in users' carts are in DB)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("cartItems");
        window.localStorage.removeItem("cartCoupon");
        window.dispatchEvent(new Event("cart-updated"));
        window.dispatchEvent(new Event("coupon-updated"));
      }
    }
  }, [isLoggedIn]);

  // When a user logs in, merge any existing guest cart from localStorage into
  // the server cart, then sync the final server cart back to localStorage.
  useEffect(() => {
    const syncGuestCartToServer = async () => {
      if (!isLoggedIn || hasSyncedOnLoginRef.current) return;
      hasSyncedOnLoginRef.current = true;

      if (typeof window === "undefined") return;

      try {
        const rawLocal = window.localStorage.getItem("cartItems");
        const localItems = rawLocal ? JSON.parse(rawLocal) : [];

        // If no local items, just sync from server
        if (!Array.isArray(localItems) || localItems.length === 0) {
          await syncCartFromServer();
          return;
        }

        // Load current server cart to avoid double‑counting quantities
        let serverItems = [];
        try {
          const res = await axiosInstance.get("/cart/get-cart");
          const formattedCart = res?.data?.data?.formattedCart;
          if (formattedCart && Array.isArray(formattedCart.items)) {
            serverItems = formattedCart.items.map((it) => {
              const productId = it?.product?._id || it?.product;
              const variantId = it?.variant?._id || it?.variant;
              const id = variantId ? `${productId}_${variantId}` : productId;
              const qty = Number(it?.quantity) > 0 ? Number(it.quantity) : 1;
              return { id: String(id), productId, variantId, quantity: qty };
            });
          }
        } catch {
          // If fetching server cart fails, we'll just replay all local items
          serverItems = [];
        }

        const serverMap = new Map(
          serverItems.map((it) => [String(it.id), it.quantity || 0])
        );

        // For each local item, if server has less quantity, add the difference.
        for (const item of localItems) {
          const productId = item.productId || item.id?.split("_")[0];
          const variantId = item.variantId ||
            (item.id?.includes("_") ? item.id.split("_")[1] : null);
          const idKey = String(item.id);
          const localQty = Number(item.quantity) > 0 ? Number(item.quantity) : 1;
          const serverQty = serverMap.get(idKey) || 0;
          const diff = localQty - serverQty;

          if (!productId || diff <= 0) continue;

          try {
            await addToCartApi({
              productId,
              variantId,
              quantity: diff,
            });
          } catch (err) {
            console.warn("Failed to sync local cart item to server:", err);
          }
        }

        // Finally, normalize everything by syncing from server
        await syncCartFromServer();
      } catch (err) {
        console.error("Failed to sync guest cart to server on login:", err);
      }
    };

    syncGuestCartToServer();
  }, [isLoggedIn]);

  return {
    addToCart,
    removeFromCart,
    syncCartFromServer,
    cartItems,
    setCartItems,
    isLoading,
  };
};

export default useCart;
