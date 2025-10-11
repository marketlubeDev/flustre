import { useState } from "react";

export function useFeaturesSections({ productData, setProductData, toast }) {
  const [selectedBannerType, setSelectedBannerType] = useState(null);
  const [draggedBannerIndex, setDraggedBannerIndex] = useState(null);
  const [dragOverBannerIndex, setDragOverBannerIndex] = useState(null);

  const handleBannerDragEnd = () => {
    setDraggedBannerIndex(null);
    setDragOverBannerIndex(null);
  };
  const handleBannerDragStart = (index) => {
    setDraggedBannerIndex(index);
  };
  const handleBannerDragEnter = (index) => {
    setDragOverBannerIndex(index);
  };
  const handleBannerDragOver = (event) => {
    event.preventDefault();
  };
  const handleBannerDrop = (toIndex) => {
    setProductData((prev) => {
      const list = [...(prev.featuresSections || [])];
      const fromIndex = draggedBannerIndex;
      if (
        fromIndex === null ||
        fromIndex === undefined ||
        toIndex === null ||
        toIndex === undefined ||
        fromIndex === toIndex
      ) {
        return prev;
      }
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return { ...prev, featuresSections: list };
    });
    setDraggedBannerIndex(null);
    setDragOverBannerIndex(null);
  };

  const handleBannerTypeSelect = (bannerType) => {
    setSelectedBannerType(bannerType);
    setProductData((prev) => {
      const list = [...(prev.featuresSections || [])];
      const newSection = (() => {
        switch (bannerType) {
          case "full-width-video":
            return {
              layout: "banner",
              imagePosition: "right",
              mediaType: "video",
              title: "",
              description: "",
              mediaUrl: "",
              mediaFile: null,
            };
          case "full-width-image":
            return {
              layout: "banner",
              imagePosition: "right",
              mediaType: "image",
              title: "",
              description: "",
              mediaUrl: "",
              mediaFile: null,
            };
          case "right-split-image":
            return {
              layout: "split",
              imagePosition: "right",
              mediaType: "image",
              title: "",
              description: "",
              mediaUrl: "",
              mediaFile: null,
            };
          case "left-split-image":
            return {
              layout: "split",
              imagePosition: "left",
              mediaType: "image",
              title: "",
              description: "",
              mediaUrl: "",
              mediaFile: null,
            };
          default:
            return {
              layout: "banner",
              imagePosition: "right",
              mediaType: "image",
              title: "",
              description: "",
              mediaUrl: "",
              mediaFile: null,
            };
        }
      })();
      list.push(newSection);
      return { ...prev, featuresSections: list };
    });
  };

  const updateMultiFeature = (index, field, value) => {
    setProductData((prev) => {
      const list = [...(prev.featuresSections || [])];
      const currentSection = { ...(list[index] || {}) };
      currentSection[field] = value;
      if (field === "layout" && value === "split") {
        currentSection.mediaType = "image";
      }
      list[index] = currentSection;
      return { ...prev, featuresSections: list };
    });
  };

  const updateMultiFeatureMedia = (index, file) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    if (!isImage && !isVideo) {
      toast?.error?.(
        "Only image or video files are allowed for features media"
      );
      return;
    }
    const maxSize = isVideo ? 20 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast?.error?.(isVideo ? "Video must be ≤ 20MB" : "Image must be ≤ 2MB");
      return;
    }
    setProductData((prev) => {
      const list = [...(prev.featuresSections || [])];
      const curr = { ...(list[index] || {}) };
      curr.mediaType = isVideo ? "video" : "image";
      curr.mediaFile = file;
      list[index] = curr;
      return { ...prev, featuresSections: list };
    });
  };

  return {
    selectedBannerType,
    setSelectedBannerType,
    draggedBannerIndex,
    dragOverBannerIndex,
    handleBannerDragStart,
    handleBannerDragEnter,
    handleBannerDragOver,
    handleBannerDrop,
    handleBannerDragEnd,
    handleBannerTypeSelect,
    updateMultiFeature,
    updateMultiFeatureMedia,
  };
}
