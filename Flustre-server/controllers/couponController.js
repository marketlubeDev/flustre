const Coupon = require("../model/couponModel");
const Product = require("../model/productModel");
const Category = require("../model/categoryModel");
const SubCategory = require("../model/subCategoryModel");
const Cart = require("../model/cartModel");
const AppError = require("../utilities/errorHandlings/appError");
const catchAsync = require("../utilities/errorHandlings/catchAsync");
const { formatCartResponse } = require("../helpers/cartHelpers/cartHelper");

const createCoupon = catchAsync(async (req, res, next) => {
  const body = req.body || {};
  const {
    code,
    discountType,
    discountAmount,
    minPurchase,
    maxDiscount,
    expiryDate,
    description,
    isActive,
    usageLimit,
    applyTo,
    categoryId,
    subcategoryId,
    productIds,
  } = body;

  // Basic validation around applicability
  if (applyTo === "order") {
    if (minPurchase === undefined || Number(minPurchase) < 0) {
      return next(
        new AppError("minPurchase must be provided for order coupons", 400)
      );
    }
  }

  if (
    applyTo === "product" &&
    (!Array.isArray(productIds) || productIds.length === 0)
  ) {
    return next(
      new AppError(
        "productIds must be a non-empty array for product coupons",
        400
      )
    );
  }
  if (applyTo === "category" && !categoryId) {
    return next(
      new AppError("categoryId is required for category coupons", 400)
    );
  }
  if (applyTo === "subcategory" && !subcategoryId) {
    return next(
      new AppError("subcategoryId is required for subcategory coupons", 400)
    );
  }

  const coupon = new Coupon({
    code,
    discountType,
    discountAmount: Number(discountAmount),
    minPurchase: Number(minPurchase || 0),
    maxDiscount: maxDiscount !== undefined ? Number(maxDiscount) : undefined,
    expiryDate,
    description,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    usageLimit: usageLimit !== undefined ? Number(usageLimit) : 0,
    applyTo: applyTo || "order",
    categoryId: categoryId || undefined,
    subcategoryId: subcategoryId || undefined,
    productIds: Array.isArray(productIds) ? productIds : [],
  });

  const savedCoupon = await coupon.save();

  // Backlink the coupon to the selected targets
  if (
    coupon.applyTo === "product" &&
    Array.isArray(coupon.productIds) &&
    coupon.productIds.length > 0
  ) {
    await Product.updateMany(
      { _id: { $in: coupon.productIds } },
      { $addToSet: { coupons: coupon._id } }
    );
  }
  if (coupon.applyTo === "category" && coupon.categoryId) {
    await Category.updateOne(
      { _id: coupon.categoryId },
      { $addToSet: { coupons: coupon._id } }
    );
  }
  if (coupon.applyTo === "subcategory" && coupon.subcategoryId) {
    await SubCategory.updateOne(
      { _id: coupon.subcategoryId },
      { $addToSet: { coupons: coupon._id } }
    );
  }

  res.status(201).json({ coupon: savedCoupon });
});

const editCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const update = { ...(req.body || {}) };

  // Normalize numeric fields
  if (update.discountAmount !== undefined)
    update.discountAmount = Number(update.discountAmount);
  if (update.minPurchase !== undefined)
    update.minPurchase = Number(update.minPurchase);
  if (update.maxDiscount !== undefined)
    update.maxDiscount = Number(update.maxDiscount);
  if (update.usageLimit !== undefined)
    update.usageLimit = Number(update.usageLimit);
  if (update.isActive !== undefined) update.isActive = Boolean(update.isActive);

  // Validate applicability fields when changing applyTo
  if (update.applyTo) {
    if (update.applyTo === "product") {
      if (!Array.isArray(update.productIds) || update.productIds.length === 0) {
        return next(
          new AppError(
            "productIds must be provided when applyTo is product",
            400
          )
        );
      }
      update.categoryId = undefined;
      update.subcategoryId = undefined;
      update.minPurchase = 0;
    } else if (update.applyTo === "category") {
      if (!update.categoryId) {
        return next(
          new AppError("categoryId is required when applyTo is category", 400)
        );
      }
      update.productIds = [];
      update.subcategoryId = undefined;
      update.minPurchase = 0;
    } else if (update.applyTo === "subcategory") {
      if (!update.subcategoryId) {
        return next(
          new AppError(
            "subcategoryId is required when applyTo is subcategory",
            400
          )
        );
      }
      update.productIds = [];
      update.categoryId = undefined;
      update.minPurchase = 0;
    } else if (update.applyTo === "order") {
      if (update.minPurchase === undefined || Number(update.minPurchase) < 0) {
        return next(
          new AppError("minPurchase must be provided for order coupons", 400)
        );
      }
      update.productIds = [];
      update.categoryId = undefined;
      update.subcategoryId = undefined;
    }
  }

  // Find existing coupon for backlink cleanup if applyTo/targets change
  const existing = await Coupon.findById(id);
  const coupon = await Coupon.findByIdAndUpdate(id, update, { new: true });

  // Remove old backlinks
  if (existing) {
    if (
      existing.applyTo === "product" &&
      Array.isArray(existing.productIds) &&
      existing.productIds.length > 0
    ) {
      await Product.updateMany(
        { _id: { $in: existing.productIds } },
        { $pull: { coupons: existing._id } }
      );
    }
    if (existing.applyTo === "category" && existing.categoryId) {
      await Category.updateOne(
        { _id: existing.categoryId },
        { $pull: { coupons: existing._id } }
      );
    }
    if (existing.applyTo === "subcategory" && existing.subcategoryId) {
      await SubCategory.updateOne(
        { _id: existing.subcategoryId },
        { $pull: { coupons: existing._id } }
      );
    }
  }

  // Add new backlinks
  if (coupon) {
    if (
      coupon.applyTo === "product" &&
      Array.isArray(coupon.productIds) &&
      coupon.productIds.length > 0
    ) {
      await Product.updateMany(
        { _id: { $in: coupon.productIds } },
        { $addToSet: { coupons: coupon._id } }
      );
    }
    if (coupon.applyTo === "category" && coupon.categoryId) {
      await Category.updateOne(
        { _id: coupon.categoryId },
        { $addToSet: { coupons: coupon._id } }
      );
    }
    if (coupon.applyTo === "subcategory" && coupon.subcategoryId) {
      await SubCategory.updateOne(
        { _id: coupon.subcategoryId },
        { $addToSet: { coupons: coupon._id } }
      );
    }
  }
  res.status(200).json({ coupon });
});

const searchCoupon = catchAsync(async (req, res) => {
  const { q } = req.query;

  const coupons = await Coupon.find({
    code: { $regex: q, $options: "i" },
    isActive: true,
    expiryDate: { $gt: new Date() },
  });

  res.status(200).json({
    status: "success",
    count: coupons.length,
    data: {
      coupons,
    },
  });
});

const removeCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;
  const existing = await Coupon.findById(id);
  if (existing) {
    if (
      existing.applyTo === "product" &&
      Array.isArray(existing.productIds) &&
      existing.productIds.length > 0
    ) {
      await Product.updateMany(
        { _id: { $in: existing.productIds } },
        { $pull: { coupons: existing._id } }
      );
    }
    if (existing.applyTo === "category" && existing.categoryId) {
      await Category.updateOne(
        { _id: existing.categoryId },
        { $pull: { coupons: existing._id } }
      );
    }
    if (existing.applyTo === "subcategory" && existing.subcategoryId) {
      await SubCategory.updateOne(
        { _id: existing.subcategoryId },
        { $pull: { coupons: existing._id } }
      );
    }
  }
  await Coupon.findByIdAndDelete(id);
  res.status(200).json({ message: "Coupon removed successfully" });
});

const getAllCoupons = catchAsync(async (req, res) => {
  const coupons = await Coupon.find();
  res.status(200).json({ coupons });
});

const applyCoupon = catchAsync(async (req, res, next) => {
  const { couponId } = req.body;
  const userId = req.user;

  // Find the cart for the user
  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.product",
      select: "name description images brand category subcategory",
    })
    .populate({
      path: "items.variant",
      select: "sku price offerPrice stock stockStatus attributes images",
    });

  if (!cart || cart.items.length === 0) {
    return next(new AppError("Cart not found or empty", 404));
  }

  // Find the coupon
  const coupon = await Coupon.findOne({
    _id: couponId,
    isActive: true,
    expiryDate: { $gt: new Date() },
  });

  if (!coupon) {
    return next(new AppError("Invalid or expired coupon", 400));
  }

  // Calculate cart total (using the existing totalPrice)
  const cartTotal = cart.totalPrice;

  // Enforce usage limit if configured
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return next(new AppError("Coupon usage limit reached", 400));
  }

  // Check minimum purchase requirement
  if (cartTotal < coupon.minPurchase) {
    return next(
      new AppError(
        `Minimum purchase of ₹${coupon.minPurchase} required to use this coupon`,
        400
      )
    );
  }

  // Determine eligible items based on applyTo
  const eligibleItemIds = new Set();
  if (coupon.applyTo === "product") {
    (cart.items || []).forEach((item) => {
      if (
        coupon.productIds?.some((id) => String(id) === String(item.product))
      ) {
        eligibleItemIds.add(String(item.product));
      }
    });
  } else if (
    coupon.applyTo === "category" ||
    coupon.applyTo === "subcategory"
  ) {
    (cart.items || []).forEach((item) => {
      const product = item.product;
      const productDoc = item.product; // populated in earlier populate
    });
  }

  // Compute discount base amount depending on applicability
  let baseAmount = cartTotal;
  if (coupon.applyTo === "product") {
    baseAmount = (cart.items || []).reduce((sum, item) => {
      return coupon.productIds?.some(
        (id) => String(id) === String(item.product)
      )
        ? sum + (item.offerPrice || item.price) * item.quantity
        : sum;
    }, 0);
  } else if (coupon.applyTo === "category") {
    baseAmount = (cart.items || []).reduce((sum, item) => {
      const prod = item.product;
      const belongs =
        prod?.category &&
        String(prod.category?._id || prod.category) ===
          String(coupon.categoryId);
      return belongs
        ? sum + (item.offerPrice || item.price) * item.quantity
        : sum;
    }, 0);
  } else if (coupon.applyTo === "subcategory") {
    baseAmount = (cart.items || []).reduce((sum, item) => {
      const prod = item.product;
      const belongs =
        prod?.subcategory &&
        String(prod.subcategory?._id || prod.subcategory) ===
          String(coupon.subcategoryId);
      return belongs
        ? sum + (item.offerPrice || item.price) * item.quantity
        : sum;
    }, 0);
  }

  // Calculate discount from base amount
  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = Math.floor((baseAmount * coupon.discountAmount) / 100);
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  } else if (coupon.discountType === "fixed") {
    discountAmount = coupon.discountAmount;
    // If applicability is restricted and fixed > base, cap to base
    if (discountAmount > baseAmount) discountAmount = baseAmount;
  }

  // Calculate final amount
  const finalAmount = cartTotal - discountAmount;

  // Update cart with coupon details
  cart.couponApplied = {
    couponId: coupon._id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountAmount: discountAmount,
    originalAmount: cartTotal,
    finalAmount: finalAmount,
  };
  cart.couponStatus = true;

  // Increment coupon used count
  coupon.usedCount = (coupon.usedCount || 0) + 1;
  await coupon.save();

  const updatedCart = await cart.save();

  // Format the response using your existing cart formatter
  const formattedCart = {
    ...formatCartResponse(updatedCart),
    couponDetails: {
      code: coupon.code,
      discountType: coupon.discountType,
      originalAmount: cartTotal,
      discountAmount: discountAmount,
      finalAmount: finalAmount,
      savings: discountAmount,
      description: coupon.description,
    },
  };

  res.status(200).json({
    success: true,
    message: "Coupon applied successfully",
    data: { formattedCart, finalAmount },
  });
});

const removeCouponFromCart = catchAsync(async (req, res, next) => {
  const userId = req.user;

  // Find the cart and populate necessary fields
  const cart = await Cart.findOne({ user: userId })
    .populate({
      path: "items.product",
      select: "name description images brand category",
      populate: [
        { path: "brand", select: "name" },
        { path: "category", select: "name" },
      ],
    })
    .populate({
      path: "items.variant",
      select: "sku price offerPrice stock stockStatus attributes images",
    });

  if (!cart) {
    return next(new AppError("Cart not found", 404));
  }

  if (!cart.couponApplied) {
    return next(new AppError("No coupon applied to remove", 400));
  }

  // Remove coupon details
  cart.couponApplied = undefined;
  cart.couponStatus = false;
  const updatedCart = await cart.save();

  // Format the response using your existing cart formatter
  const formattedCart = formatCartResponse(updatedCart);

  // Structure response data to match other cart operations
  const responseData = {
    formattedCart,
    finalAmount: updatedCart.totalPrice,
  };

  res.status(200).json({
    success: true,
    message: "Coupon removed successfully",
    data: responseData,
  });
});

module.exports = {
  createCoupon,
  editCoupon,
  searchCoupon,
  removeCoupon,
  getAllCoupons,
  applyCoupon,
  removeCouponFromCart,
};
