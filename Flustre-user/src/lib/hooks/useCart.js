import { useState } from "react";
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
      const formattedCart = response?.data?.formattedCart;

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
