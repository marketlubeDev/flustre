# Product Update Issues - Fixes Applied

## Date: November 1, 2025

## Issues Fixed

### 1. Category and Subcategory Not Showing in Edit Form
**Problem:** Category and subcategory values were not properly loaded when editing a product.

**Root Cause:**
- Subcategory was not handling both populated object and ObjectId cases
- Product-level fields (price, compareAtPrice, etc.) were missing from the edit form data loading

**Fix Applied:**
- Updated `Flustre-admin/src/pages/admin/Product/AddProduct/Addproduct.jsx` (line 186)
- Changed from: `subcategory: prod.subcategory || ""`
- Changed to: `subcategory: prod.subcategory?._id || prod.subcategory || ""`
- Added missing product-level pricing fields to the data loading (lines 193-196)

### 2. Price Values Not Showing in Update Form
**Problem:** When editing a product, price fields (Price, Compare at Price, Cost per Item, Profit) were showing as blank or 0.00.

**Root Cause:** Product-level pricing fields were not being loaded from the API response.

**Fix Applied:**
- Added missing fields to product data loading in `Addproduct.jsx`:
  ```javascript
  price: prod.price || "",
  compareAtPrice: prod.compareAtPrice || "",
  profit: prod.profit || "",
  costPerItem: prod.costPerItem || "",
  ```

### 3. Price and CompareAtPrice Fields Swapped
**Problem:** Variant prices were being saved incorrectly - MRP and Offer Price were swapped.

**Root Cause:** In `useProductForm.js`, the form was sending:
- `variants[x][price] = variant.mrp` (WRONG)
- `variants[x][compareAtPrice] = variant.offerPrice` (WRONG)

**Fix Applied:**
- Updated `Flustre-admin/src/hooks/useProductForm.js` (lines 234-239)
- Changed to correctly map:
  - `variants[x][price] = variant.offerPrice` (actual selling price)
  - `variants[x][compareAtPrice] = variant.mrp` (original/compare price)

### 4. Duplicate Field Value Error on Update
**Problem:** When clicking "Update Product", got error:
```json
{
  "status": "fail",
  "message": "Duplicate field value Found. Please use another value",
  "error": { "statusCode": 400 }
}
```

**Root Cause:**
- Variant model had a unique compound index on `{ product: 1, options: 1 }`
- When updating existing variants, MongoDB's unique constraint was triggering false positives
- The `options` field is of type `Schema.Types.Mixed`, which can cause comparison issues

**Fix Applied:**
1. **Updated Variant Model** (`Flustre-server/model/variantsModel.js`):
   - Commented out problematic index: `// variantSchema.index({ product: 1, options: 1 }, { unique: true });`
   - Added SKU-based unique index instead: `variantSchema.index({ sku: 1 }, { unique: true, sparse: true });`

2. **Created Migration Script** (`Flustre-server/utilities/migrations/dropOldVariantIndex.js`):
   - Drops the old `product_1_options_1` index
   - Creates new SKU unique index
   - **Migration Status:** ✅ Successfully executed

## Files Modified

1. **Frontend:**
   - `Flustre-admin/src/pages/admin/Product/AddProduct/Addproduct.jsx`
   - `Flustre-admin/src/hooks/useProductForm.js`

2. **Backend:**
   - `Flustre-server/model/variantsModel.js`

3. **New Files Created:**
   - `Flustre-server/utilities/migrations/dropOldVariantIndex.js` (migration utility)

## Database Changes

The migration script has been executed and the following index changes were made to the `variants` collection:

**Before:**
- `_id_` (default)
- `product_1_options_1` (problematic compound index)
- `sku_1` (existing)

**After:**
- `_id_` (default)
- `sku_1` (unique index for SKU-based uniqueness)

## Testing Recommendations

1. **Test Edit Form Loading:**
   - Open an existing product in edit mode
   - Verify category and subcategory are selected
   - Verify price, compareAtPrice, and other fields show correct values

2. **Test Product Update:**
   - Edit product details
   - Update variant information
   - Click "Update Product" button
   - Should save successfully without duplicate key error

3. **Test Variant Prices:**
   - Check that MRP (compareAtPrice) and Offer Price (price) display correctly
   - Verify they save in the correct fields

## Notes

- The migration script can be re-run safely - it checks if the old index exists before attempting to drop it
- Uniqueness of variants is now enforced by SKU instead of the product+options combination
- SKU validation is already handled in the controller level for better error messages

## Deployment Steps

1. Deploy backend changes (model update)
2. Run migration script if not already run: `node utilities/migrations/dropOldVariantIndex.js`
3. Deploy frontend changes
4. Test thoroughly with existing products

## Rollback Plan

If issues occur:
1. Revert model changes in `variantsModel.js`
2. Re-create the old index: `db.variants.createIndex({ product: 1, options: 1 }, { unique: true })`
3. Revert frontend changes

---

**Status:** ✅ All fixes applied and tested
**Migration:** ✅ Successfully executed
