import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setProductData as setProductDataAction } from "../../../../../redux/features/productCreationSlice";
import ProductFeaturesSection from "./ProductFeaturesSection";
import FeatureBannersPicker from "./FeatureBannersPicker";

export default function FeaturesStep({
  selectedBannerType,
  setSelectedBannerType,
  updateMultiFeatureMedia,
  updateMultiFeature,
  dragOverBannerIndex,
  handleBannerDragStart,
  handleBannerDragEnter,
  handleBannerDragOver,
  handleBannerDrop,
  handleBannerDragEnd,
  handleBannerTypeSelect,
}) {
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.productCreation.productData);
  const setProductData = (updater) => {
    if (typeof updater === "function") {
      const next = updater(productData);
      dispatch(setProductDataAction(next));
    } else {
      dispatch(setProductDataAction(updater));
    }
  };
  const getBannerConfig = () => {
    switch (selectedBannerType) {
      case "full-width-video":
        return {
          title: "Full width video",
          subtitle: "21:9 ratio",
          mediaType: "video",
          layout: "banner",
        };
      case "full-width-image":
        return {
          title: "Full width image",
          subtitle: "21:9 ratio",
          mediaType: "image",
          layout: "banner",
        };
      case "right-split-image":
        return {
          title: "Right split image",
          subtitle: "2:1 ratio",
          mediaType: "image",
          layout: "split",
          imagePosition: "right",
        };
      case "left-split-image":
        return {
          title: "Left split image",
          subtitle: "2:1 ratio",
          mediaType: "image",
          layout: "split",
          imagePosition: "left",
        };
      default:
        return {
          title: "Banner",
          subtitle: "",
          mediaType: "image",
          layout: "banner",
        };
    }
  };

  if ((productData.featuresSections || []).length > 0) {
    const config = getBannerConfig();
    return (
      <ProductFeaturesSection
        productData={productData}
        setProductData={setProductData}
        setSelectedBannerType={setSelectedBannerType}
        config={config}
        updateMultiFeatureMedia={updateMultiFeatureMedia}
        updateMultiFeature={updateMultiFeature}
        dragOverBannerIndex={dragOverBannerIndex}
        handleBannerDragStart={handleBannerDragStart}
        handleBannerDragEnter={handleBannerDragEnter}
        handleBannerDragOver={handleBannerDragOver}
        handleBannerDrop={handleBannerDrop}
        handleBannerDragEnd={handleBannerDragEnd}
        handleBannerTypeSelect={handleBannerTypeSelect}
      />
    );
  }

  return <FeatureBannersPicker onSelect={handleBannerTypeSelect} />;
}
