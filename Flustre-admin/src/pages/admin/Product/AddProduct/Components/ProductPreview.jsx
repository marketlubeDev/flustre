import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "antd";
import { useSelector } from "react-redux";

function ProductPreview({
  onEditProductInfo = () => {},
  onEditFeatures = () => {},
  onEditVariants = () => {},
}) {
  const productData = useSelector((state) => state.productCreation.productData);
  const variants = useSelector((state) => state.productCreation.variants);
  const categories = useSelector((state) => state.adminUtilities.categories);

  // Force re-render when variants change
  const [forceRender, setForceRender] = useState(0);
  useEffect(() => {
    setForceRender((prev) => prev + 1);
  }, [variants]);

  // Debug: Log Redux state when Preview renders
  console.log(
    "Preview - Redux variants state:",
    variants?.map((v, idx) => ({
      index: idx,
      name: v.name,
      images: v.images,
      imagesLength: v.images?.length,
      imagesFiltered: v.images?.filter(Boolean)?.length,
      imageValues: v.images?.map((img, imgIdx) => ({
        imgIdx,
        value: img,
        isTruthy: Boolean(img),
      })),
      rawImages: v.images,
    })),
    "forceRender:",
    forceRender
  );

  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);

  const showSubcategory = useMemo(() => {
    if (!productData?.category || !Array.isArray(categories)) return [];
    const selected = categories.find((c) => c._id === productData.category);
    return selected?.subcategories || [];
  }, [productData?.category, categories]);

  const toSrc = (img) =>
    typeof img === "string"
      ? img
      : img instanceof File
      ? URL.createObjectURL(img)
      : null;

  const openVariantImagePreview = (variant) => {
    const imgs = Array.isArray(variant?.images)
      ? variant.images.filter(Boolean)
      : [];
    const srcs = imgs.map(toSrc).filter(Boolean).slice(0, 10);
    setPreviewImages(srcs);
    setIsImagePreviewOpen(true);
  };

  const closeVariantImagePreview = () => {
    setIsImagePreviewOpen(false);
    setPreviewImages([]);
  };
  // Variants are already normalized/deduped at source (Addproduct.jsx)
  return (
    <div className=" ">
      <div className="space-y-6">
        {/* Product Info Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#3573BA1A] px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h4 className="text-xs font-medium text-[#3573BA] uppercase tracking-wide">
              PRODUCT INFO
            </h4>
            <button
              onClick={onEditProductInfo}
              className="text-[#3573BA] text-sm hover:underline flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
          </div>
          <div className="p-4 space-y-4">
            {/* Product name, Category and Subcategory in one line */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 tracking-wide mb-1 block">
                  Product name
                </label>
                <p className="font-medium text-gray-900 text-sm">
                  {productData.name || "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 tracking-wide mb-1 block">
                  Category
                </label>
                <p className="font-medium text-gray-900 text-sm">
                  {categories?.find((c) => c._id === productData.category)
                    ?.name || "Not selected"}
                </p>
              </div>
              <div>
                <label className="text-xs text-gray-500 tracking-wide mb-1 block">
                  Sub Category
                </label>
                <p className="font-medium text-gray-900 text-sm">
                  {showSubcategory.find(
                    (s) => s._id === productData.subcategory
                  )?.name || "Not selected"}
                </p>
              </div>
            </div>

            {/* About/Description */}
            <div>
              <label className="text-xs text-gray-500 tracking-wide mb-2 block">
                About/Description
              </label>
              <div className="font-medium text-gray-900 text-sm">
                <p>{productData.about || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#3573BA1A] px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h4 className="text-xs font-medium text-[#3573BA] uppercase tracking-wide">
              FEATURES
            </h4>
            <button
              onClick={onEditFeatures}
              className="text-[#3573BA] text-sm hover:underline flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(productData.featuresSections || [])
                .slice(0, 4)
                .map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-xs text-gray-500 tracking-wide">
                      Banner {idx + 1} ({section.layout} layout)
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded border overflow-hidden flex items-center justify-center">
                        {section.mediaType === "video" ? (
                          <img
                            src="/icons/addbannervideo.svg"
                            alt="video"
                            className="w-4 h-4"
                          />
                        ) : section.mediaFile ? (
                          <img
                            src={URL.createObjectURL(section.mediaFile)}
                            alt="banner"
                            className="w-full h-full object-cover"
                          />
                        ) : section.mediaUrl ? (
                          <img
                            src={section.mediaUrl}
                            alt="banner"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-4 h-4 bg-gray-300 rounded" />
                        )}
                      </div>
                      <span className="text-xs text-gray-700 font-medium">
                        {(section.mediaFile && section.mediaFile.name) ||
                          (section.mediaUrl &&
                            section.mediaUrl.split("/").pop()) ||
                          "No media"}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-gray-900">
                      {section.title ||
                        section.description ||
                        `Feature ${idx + 1}`}
                    </p>
                  </div>
                ))}

              {(!productData.featuresSections ||
                productData.featuresSections.length === 0) && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Banner 1 (right split image)
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          Why You'll Love This T-Shirt
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                        <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Banner 2 (left split image)
                        </p>
                        <p className="text-sm font-medium text-gray-700">
                          Everyday Convenience
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Variant Info Section */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-[#3573BA1A] px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h4 className="text-xs font-medium text-[#3573BA] uppercase tracking-wide">
              VARIANT INFO
            </h4>
            <button
              onClick={onEditVariants}
              className="text-[#3573BA] text-sm hover:underline flex items-center gap-1"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </button>
          </div>
          <div className="overflow-x-auto p-4 ">
            <div className="overflow-hidden rounded-lg">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="divide-x divide-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide rounded-tl-lg">
                      Variant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Compare at price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wide rounded-tr-lg">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(variants || []).map((variant, idx) => (
                    <tr
                      key={`${idx}-${variant.name}-${forceRender}`}
                      className={`hover:bg-gray-50 divide-x divide-gray-200 ${
                        idx === (variants?.length || 0) - 1
                          ? "last:rounded-b-lg"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 border border-gray-200 rounded overflow-hidden bg-white cursor-pointer"
                            onClick={() => openVariantImagePreview(variant)}
                            title="View images"
                          >
                            {(() => {
                              const imgs = Array.isArray(variant.images)
                                ? variant.images.filter(Boolean)
                                : [];

                              // Debug: Log variant images in preview
                              console.log(
                                `Preview - Variant: ${variant.name}`,
                                {
                                  images: imgs,
                                  imagesLength: imgs.length,
                                  variantImages: variant.images,
                                  variantImageValues: variant.images?.map(
                                    (img, imgIdx) => ({
                                      imgIdx,
                                      value: img,
                                      isTruthy: Boolean(img),
                                    })
                                  ),
                                  forceRender: forceRender,
                                  rawImages: variant.images,
                                  // Detailed inspection
                                  image0: variant.images?.[0],
                                  image1: variant.images?.[1],
                                  image2: variant.images?.[2],
                                  image3: variant.images?.[3],
                                  allImagesTruthy: variant.images?.map((img) =>
                                    Boolean(img)
                                  ),
                                }
                              );

                              const toSrc = (img) =>
                                typeof img === "string"
                                  ? img
                                  : img instanceof File
                                  ? URL.createObjectURL(img)
                                  : null;
                              if (imgs.length === 0) {
                                return (
                                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <svg
                                      className="w-3 h-3 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z"
                                      />
                                    </svg>
                                  </div>
                                );
                              }
                              if (imgs.length === 1) {
                                const src = toSrc(imgs[0]);
                                return (
                                  <img
                                    src={src || ""}
                                    alt="variant"
                                    className="w-full h-full object-cover"
                                  />
                                );
                              }
                              const collage = imgs
                                .slice(0, 4)
                                .map(toSrc)
                                .filter(Boolean);
                              const cell = Math.floor((32 - 2) / 2); // 32px = w-8/h-8, 2px gap
                              const cellDim = `${cell}px`;
                              return (
                                <div
                                  className="grid grid-cols-2 grid-rows-2 gap-[2px] bg-white rounded overflow-hidden"
                                  style={{ width: "32px", height: "32px" }}
                                  title={`${imgs.length} images`}
                                >
                                  {collage.map((src, i) => (
                                    <img
                                      key={i}
                                      src={src}
                                      alt={`thumb-${i}`}
                                      className="object-cover"
                                      style={{
                                        width: cellDim,
                                        height: cellDim,
                                      }}
                                    />
                                  ))}
                                </div>
                              );
                            })()}
                          </div>
                          <span className="text-sm text-gray-900">
                            {variant.name || `Variant ${idx + 1}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-md"
                          style={{ background: "#F7F7F7" }}
                        >
                          <span
                            className="text-xs text-gray-500 mr-1"
                            style={{ color: "#B0B0B0" }}
                          >
                            AED
                          </span>
                          <span className="font-medium">
                            {variant.mrp || "0"}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-md"
                          style={{ background: "#F7F7F7" }}
                        >
                          <span
                            className="text-xs text-gray-500 mr-1"
                            style={{ color: "#B0B0B0" }}
                          >
                            AED
                          </span>
                          <span className="font-medium">
                            {variant.offerPrice || "0"}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-md"
                          style={{ background: "#F7F7F7" }}
                        >
                          <span className="font-medium">
                            {variant.stockQuantity || "0"}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-md"
                          style={{ background: "#F7F7F7" }}
                        >
                          {variant.sku || "Not set"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2z"
                              />
                            </svg>
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {/* Variant Images Preview Modal */}
      <Modal
        open={isImagePreviewOpen}
        onCancel={closeVariantImagePreview}
        footer={null}
        width={720}
        styles={{ content: { borderRadius: 12 } }}
        title={<div className="text-base font-semibold">Variant images</div>}
      >
        {previewImages.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">
            No images uploaded for this variant.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {previewImages.map((src, i) => (
              <div
                key={i}
                className="w-full aspect-square rounded overflow-hidden border"
              >
                <img
                  src={src}
                  alt={`variant-${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ProductPreview;
