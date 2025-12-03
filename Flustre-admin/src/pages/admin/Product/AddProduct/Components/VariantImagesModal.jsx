import React, { useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import { uploadMultipleImagesToS3 } from "../../../../../sevices/s3UploadApis";

const VariantImagesModal = ({
  open = false,
  initialImages = [],
  onCancel,
  onSave,
  productName,
  variantIndex = null,
  isGroupImage = false,
  groupName = null,
  hasIndividualImages = false,
}) => {
  const [tempImages, setTempImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  const slugify = (value) => {
    if (!value) return "";
    return String(value)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  useEffect(() => {
    if (open) {
      const cleaned = Array.isArray(initialImages)
        ? initialImages.filter(Boolean).slice(0, 5)
        : [];
      setTempImages(cleaned);
    }
  }, [open, initialImages]);

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const imagesOnly = files.filter(
      (f) => f && f.type && f.type.startsWith("image/")
    );
    const next = [...tempImages];
    imagesOnly.forEach((img) => {
      if (next.length < 5) next.push(img);
    });
    setTempImages(next);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeTempImageAt = (idx) => {
    setTempImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const cleaned = Array.isArray(tempImages)
        ? tempImages.filter(Boolean).slice(0, 5)
        : [];

      const existingUrls = cleaned
        .filter((img) => typeof img === "string")
        .slice(0, 5);

      const filesToUpload = cleaned.filter((img) => img instanceof File);

      let uploadedUrls = [];
      if (filesToUpload.length) {
        const slug = slugify(productName);
        let filename;

        if (isGroupImage && groupName) {
          // Group image filename
          const groupSlug = slugify(groupName);
          filename = slug
            ? `${slug}-group-${groupSlug}`
            : `group-image-${groupSlug}`;
        } else {
          // Individual variant image filename
          const variantSuffix =
            variantIndex !== null ? `-variant-${variantIndex}` : "-variant";
          filename = slug
            ? `${slug}${variantSuffix}`
            : `variant-image${variantSuffix}`;
        }

        uploadedUrls = await uploadMultipleImagesToS3(filesToUpload, {
          folder: "products",
          filename: filename,
        });

        // Append cache-busting param to ensure the latest image shows in the table
        const ts = Date.now();
        uploadedUrls = (uploadedUrls || []).map((u) =>
          typeof u === "string" && u
            ? `${u}${u.includes("?") ? "&" : "?"}v=${ts}`
            : u
        );
      }

      const finalUrls = [...existingUrls, ...uploadedUrls].slice(0, 5);
      if (onSave) onSave(finalUrls);
    } catch (error) {
      console.error("Failed to upload images:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      styles={{
        content: { borderRadius: 16, overflow: "hidden", padding: 0 },
        header: { borderBottom: "1px solid rgba(0,0,0,0.1)", padding: 16 },
        body: { paddingTop: 16, paddingBottom: 16 },
        footer: { borderTop: "1px solid rgba(0,0,0,0.1)", padding: 16 },
      }}
      title={
        <div className="text-lg font-semibold text-[#000000]">
          {isGroupImage
            ? `Upload image for ${groupName} group`
            : "Upload image"}
        </div>
      }
      width={880}
      footer={[
        <button
          key="cancel"
          className="px-6 py-2 text-sm rounded-lg text-[#FB3748] mr-2 min-w-[100px]"
          onClick={onCancel}
        >
          Cancel
        </button>,
        <button
          key="save"
          className="px-6 py-2 text-sm text-white hover:opacity-95 min-w-[100px]"
          style={{
            borderRadius: "8px",
            borderBottom: "1px solid #6C9BC8",
            background: "linear-gradient(180deg, #3573BA 30.96%, #6FA0D5 100%)",
            boxShadow: "0 1px 2px 0 rgba(92, 139, 189, 0.5)",
          }}
          onClick={handleSave}
          disabled={!tempImages?.length || saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>,
      ]}
    >
      <div className="space-y-4 px-6">
        <p className="text-sm text-gray-600">
          {isGroupImage
            ? `Upload max 5 images for ${groupName} group — these will apply to all variants in this group unless they have individual images`
            : variantIndex !== null &&
              initialImages.length > 0 &&
              !hasIndividualImages
            ? "These images are currently inherited from the group. Upload new images to override them for this variant only."
            : "Upload max 5 images per variant — 1:1 ratio ensures best fit"}
        </p>
        <div className="border-2 border-dashed rounded-2xl p-6 min-h-[200px] flex flex-col items-center justify-center text-center relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleAddImages}
          />
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            +
          </button>
          <div className="text-xs text-gray-500 mt-2">
            Product Image (upto 5)
          </div>
          <div className="text-[10px] text-gray-400">1:1 ratio</div>
        </div>

        {!isGroupImage &&
          variantIndex !== null &&
          initialImages.length > 0 &&
          !hasIndividualImages && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-700 font-medium">
                  Currently showing inherited group images
                </span>
              </div>
            </div>
          )}

        {Array.isArray(tempImages) && tempImages.filter(Boolean).length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {tempImages.filter(Boolean).map((img, idx) => {
              const url =
                typeof img === "string"
                  ? img
                  : img instanceof File
                  ? URL.createObjectURL(img)
                  : null;
              if (!url) return null;
              return (
                <div
                  key={idx}
                  className="relative w-16 h-16 rounded overflow-hidden border"
                >
                  <img
                    src={url}
                    alt={`preview-${idx}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/95 text-[#FB3748] border shadow-sm flex items-center justify-center"
                    onClick={() => removeTempImageAt(idx)}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VariantImagesModal;
