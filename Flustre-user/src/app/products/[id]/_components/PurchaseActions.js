"use client";

import Button from "@/app/_components/common/Button";

export default function PurchaseActions({
  product,
  selectedVariant,
  quantity,
  setQuantity,
  addToCart,
  buyNow,
  cartLoading = false,
}) {

  const currentStock =
    product?.variants &&
    product.variants.length > 0 &&
    selectedVariant !== undefined
      ? product.variants[selectedVariant]?.quantity || 0
      : 5;

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-3">
        <label className="text-xs sm:text-sm font-medium text-gray-700">
          Qty :
        </label>
        <div className="flex items-center bg-[#F7F3F4] border border-[#2B73B8] rounded-md px-1">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-1.5 py-1 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
          >
            -
          </button>
          <span
            className="px-2 py-1 text-black font-semibold text-sm sm:text-base"
            style={{ minWidth: "2ch", textAlign: "center" }}
          >
            {quantity.toString().padStart(2, "0")}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-1.5 py-1 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        <Button
          variant="buy"
          size="large"
          onClick={buyNow}
          className="flex-1 text-sm sm:text-base"
        >
          Buy Now
        </Button>
        <Button
          variant="cart"
          size="large"
          onClick={addToCart}
          className="flex-1 text-sm sm:text-base"
          disabled={cartLoading}
        >
          {cartLoading ? "Adding to cart..." : "Add to Cart"}
        </Button>
      </div>

      <div className="mt-2">
        <span
          className="text-[#FF5722] font-medium text-xs sm:text-base"
          style={{ fontSize: "13px" }}
        >
          Only <span className="font-semibold">{currentStock} stocks left</span>
          ,
        </span>
        <span
          className="text-black font-medium text-xs sm:text-base"
          style={{ fontSize: "13px" }}
        >
          {" "}
          Hurry up!
        </span>
      </div>
    </div>
  );
}
