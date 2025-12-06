const WishList = require("../model/wishListModel");
const Product = require("../model/productModel");
const Variant = require("../model/variantsModel");
const AppError = require("../utilities/errorHandlings/appError");
const catchAsync = require("../utilities/errorHandlings/catchAsync");

// Helper function to format wishlist response
const formatWishListResponse = (wishlist) => {
  if (!wishlist) return null;

  const formattedItems = wishlist.items.map((item) => {
    const product = item.product;
    const variant = item.variant;
    const hasVariant = !!variant;

    // Determine the main image based on whether there's a variant or not
    const mainImage = hasVariant
      ? variant?.images && variant?.images.length > 0
        ? variant.images[0]
        : product?.featureImages && product?.featureImages?.length > 0
        ? product.featureImages[0]
        : product?.primaryImage || null
      : product?.featureImages && product?.featureImages?.length > 0
      ? product.featureImages[0]
      : product?.primaryImage || null;

    // Determine all images
    const images = hasVariant
      ? variant?.images && variant?.images.length > 0
        ? variant.images
        : product?.featureImages || []
      : product?.featureImages || [];

    return {
      _id: item._id || item.product?._id,
      product: product
        ? {
            _id: product._id,
            name: product.name,
            description: product.description,
            mainImage,
            images,
            category: product.category,
            subcategory: product.subcategory,
            price: hasVariant ? variant?.price : product.price,
            offerPrice: hasVariant ? variant?.offerPrice : product.offerPrice,
            stock: hasVariant ? variant?.stock : product.stock,
            stockStatus: hasVariant ? variant?.stockStatus : product.stockStatus,
            averageRating: product.averageRating || 0,
            totalRatings: product.totalRatings || 0,
          }
        : null,
      variant: variant
        ? {
            _id: variant._id,
            sku: variant.sku,
            price: variant.price,
            offerPrice: variant.offerPrice,
            stock: variant.stock,
            stockStatus: variant.stockStatus,
            attributes: variant.attributes,
            images: variant.images,
          }
        : null,
      addedAt: item.addedAt,
      mainImage, // Add main image at the root level for easy access
      images, // Add all images at the root level
    };
  });

  return {
    _id: wishlist._id,
    user: wishlist.user,
    items: formattedItems,
    totalItems: wishlist.totalItems || wishlist.items.length,
    createdAt: wishlist.createdAt,
    updatedAt: wishlist.updatedAt,
  };
};

// Add item to wishlist
const addToWishList = catchAsync(async (req, res, next) => {
  const { productId, variantId } = req.body;
  const userId = req.user;

  if (!productId) {
    return next(new AppError("Product ID is required", 400));
  }

  // Validate that the product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Validate variant if provided
  let variant = null;
  if (variantId) {
    variant = await Variant.findById(variantId);
    if (!variant) {
      return next(new AppError("Variant not found", 404));
    }
    // Verify variant belongs to the product
    if (variant.product && variant.product.toString() !== productId) {
      return next(
        new AppError("Variant does not belong to the specified product", 400)
      );
    }
  }

  // Find or create wishlist
  let wishlist = await WishList.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new WishList({ user: userId, items: [] });
  }

  // Check if the product/variant is already in the wishlist
  const existingItemIndex = wishlist.items.findIndex(
    (item) =>
      (variantId &&
        item.variant &&
        item.variant.toString() === variantId &&
        item.product.toString() === productId) ||
      (!variantId &&
        item.product &&
        item.product.toString() === productId &&
        !item.variant)
  );

  if (existingItemIndex > -1) {
    return res.status(200).json({
      success: true,
      message: "Item already exists in wishlist",
      data: formatWishListResponse(wishlist),
    });
  }

  // Add new item
  const newItem = {
    product: productId,
    variant: variantId || undefined,
    addedAt: new Date(),
  };

  wishlist.items.push(newItem);
  await wishlist.save();

  // Fetch the populated wishlist to format the response
  const populatedWishlist = await WishList.findById(wishlist._id)
    .populate({
      path: "items.product",
      select:
        "name description featureImages primaryImage category subcategory price offerPrice stock stockStatus averageRating totalRatings",
      populate: [
        { path: "category", select: "name" },
        { path: "subcategory", select: "name" },
      ],
    })
    .populate({
      path: "items.variant",
      select: "sku price offerPrice stock stockStatus attributes images",
    });

  const formattedWishlist = formatWishListResponse(populatedWishlist);

  res.status(200).json({
    success: true,
    message: "Item added to wishlist successfully",
    data: formattedWishlist,
  });
});

// Remove item from wishlist
const removeFromWishList = catchAsync(async (req, res, next) => {
  const { productId, variantId } = req.body;
  const userId = req.user;

  if (!productId) {
    return next(new AppError("Product ID is required", 400));
  }

  let wishlist = await WishList.findOne({ user: userId });
  if (!wishlist) {
    return next(new AppError("Wishlist not found", 404));
  }

  // Filter out the item to remove
  wishlist.items = wishlist.items.filter((item) => {
    if (variantId) {
      // If removing a variant product, only remove the specific variant
      return !(
        item.variant &&
        item.variant.toString() === variantId &&
        item.product.toString() === productId
      );
    } else {
      // If removing a non-variant product, only remove products without variants
      return !(
        item.product.toString() === productId && !item.variant
      );
    }
  });

  await wishlist.save();

  // Fetch the populated wishlist to format the response
  const populatedWishlist = await WishList.findById(wishlist._id)
    .populate({
      path: "items.product",
      select:
        "name description featureImages primaryImage category subcategory price offerPrice stock stockStatus averageRating totalRatings",
      populate: [
        { path: "category", select: "name" },
        { path: "subcategory", select: "name" },
      ],
    })
    .populate({
      path: "items.variant",
      select: "sku price offerPrice stock stockStatus attributes images",
    });

  const formattedWishlist = formatWishListResponse(populatedWishlist);

  res.status(200).json({
    success: true,
    message: "Item removed from wishlist successfully",
    data: formattedWishlist,
  });
});

// Get wishlist
const getWishList = catchAsync(async (req, res, next) => {
  const userId = req.user;

  // Find the user's wishlist and populate necessary fields
  const wishlist = await WishList.findOne({ user: userId })
    .populate({
      path: "items.product",
      select:
        "name description featureImages primaryImage category subcategory price offerPrice stock stockStatus averageRating totalRatings activeStatus isDeleted",
      populate: [
        { path: "category", select: "name" },
        { path: "subcategory", select: "name" },
      ],
    })
    .populate({
      path: "items.variant",
      select: "sku price offerPrice stock stockStatus attributes images",
    });

  if (!wishlist) {
    const newWishlist = new WishList({ user: userId, items: [] });
    await newWishlist.save();
    return res.status(200).json({
      success: true,
      message: "Wishlist retrieved successfully",
      data: formatWishListResponse(newWishlist),
    });
  }

  // Filter out deleted or inactive products
  wishlist.items = wishlist.items.filter((item) => {
    const product = item.product;
    if (!product) return false;
    if (product.isDeleted) return false;
    if (!product.activeStatus) return false;
    return true;
  });

  await wishlist.save();

  const formattedWishlist = formatWishListResponse(wishlist);

  res.status(200).json({
    success: true,
    message: "Wishlist retrieved successfully",
    data: formattedWishlist,
  });
});

// Clear wishlist
const clearWishList = catchAsync(async (req, res, next) => {
  const userId = req.user;

  let wishlist = await WishList.findOne({ user: userId });
  if (!wishlist) {
    return next(new AppError("Wishlist not found", 404));
  }

  wishlist.items = [];
  await wishlist.save();

  const formattedWishlist = formatWishListResponse(wishlist);

  res.status(200).json({
    success: true,
    message: "Wishlist cleared successfully",
    data: formattedWishlist,
  });
});

// Sync wishlist from localStorage to DB
const syncWishList = catchAsync(async (req, res, next) => {
  const userId = req.user;
  const { items } = req.body; // Array of items from localStorage: [{ productId, variantId }]

  if (!Array.isArray(items)) {
    return next(new AppError("Items must be an array", 400));
  }

  // Find or create wishlist
  let wishlist = await WishList.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new WishList({ user: userId, items: [] });
  }

  // Track items that were successfully added
  const addedItems = [];
  const skippedItems = [];

  // Process each item from localStorage
  for (const localItem of items) {
    const { productId, variantId } = localItem;

    if (!productId) {
      skippedItems.push({
        productId,
        variantId,
        reason: "Product ID is required",
      });
      continue;
    }

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product || product.isDeleted || !product.activeStatus) {
      skippedItems.push({
        productId,
        variantId,
        reason: "Product not found or unavailable",
      });
      continue;
    }

    // Validate variant if provided
    let variant = null;
    if (variantId) {
      variant = await Variant.findById(variantId);
      if (!variant) {
        skippedItems.push({
          productId,
          variantId,
          reason: "Variant not found",
        });
        continue;
      }
      // Verify variant belongs to the product
      if (variant.product && variant.product.toString() !== productId) {
        skippedItems.push({
          productId,
          variantId,
          reason: "Variant does not belong to the product",
        });
        continue;
      }
    }

    // Check if item already exists in wishlist
    const existingItemIndex = wishlist.items.findIndex(
      (item) =>
        (variantId &&
          item.variant &&
          item.variant.toString() === variantId &&
          item.product.toString() === productId) ||
        (!variantId &&
          item.product &&
          item.product.toString() === productId &&
          !item.variant)
    );

    if (existingItemIndex === -1) {
      // Add new item
      wishlist.items.push({
        product: productId,
        variant: variantId || undefined,
        addedAt: new Date(),
      });
      addedItems.push({ productId, variantId });
    } else {
      skippedItems.push({
        productId,
        variantId,
        reason: "Item already exists in wishlist",
      });
    }
  }

  // Save the wishlist
  await wishlist.save();

  // Fetch the populated wishlist to format the response
  const populatedWishlist = await WishList.findById(wishlist._id)
    .populate({
      path: "items.product",
      select:
        "name description featureImages primaryImage category subcategory price offerPrice stock stockStatus averageRating totalRatings activeStatus isDeleted",
      populate: [
        { path: "category", select: "name" },
        { path: "subcategory", select: "name" },
      ],
    })
    .populate({
      path: "items.variant",
      select: "sku price offerPrice stock stockStatus attributes images",
    });

  const formattedWishlist = formatWishListResponse(populatedWishlist);

  res.status(200).json({
    success: true,
    message: "Wishlist synced successfully",
    data: formattedWishlist,
    syncSummary: {
      totalItemsFromLocalStorage: items.length,
      addedItems: addedItems.length,
      skippedItems: skippedItems.length,
      addedItemsList: addedItems,
      skippedItemsList: skippedItems,
    },
  });
});

// Check if product is in wishlist
const checkWishListStatus = catchAsync(async (req, res, next) => {
  const userId = req.user;
  const { productId, variantId } = req.query;

  if (!productId) {
    return next(new AppError("Product ID is required", 400));
  }

  const wishlist = await WishList.findOne({ user: userId });

  if (!wishlist || !wishlist.items || wishlist.items.length === 0) {
    return res.status(200).json({
      success: true,
      isInWishlist: false,
    });
  }

  const isInWishlist = wishlist.items.some((item) => {
    if (variantId) {
      return (
        item.variant &&
        item.variant.toString() === variantId &&
        item.product.toString() === productId
      );
    } else {
      return (
        item.product.toString() === productId && !item.variant
      );
    }
  });

  res.status(200).json({
    success: true,
    isInWishlist,
  });
});

module.exports = {
  addToWishList,
  removeFromWishList,
  getWishList,
  clearWishList,
  syncWishList,
  checkWishListStatus,
};


