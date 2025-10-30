import React from "react";

const ProductFeaturesSection = ({
  productData,
  setProductData,
  setSelectedBannerType,
  config,
  updateMultiFeatureMedia,
  updateMultiFeature,
  dragOverBannerIndex,
  handleBannerDragStart,
  handleBannerDragEnter,
  handleBannerDragOver,
  handleBannerDrop,
  handleBannerDragEnd,
  handleBannerTypeSelect,
}) => {
  return (
    <div className="h-full">
      <div className="px-0 py-0 bg-white rounded-lg h-full flex flex-col">
        <div className="flex items-center justify-between bg-[#3573BA1A] px-4 py-3 rounded-t-lg">
          <h2 className="text-sm font-semibold text-[#3573BA]">
            PRODUCT FEATURES
          </h2>
          <button
            onClick={() => {
              setProductData((prev) => ({
                ...prev,
                featuresSections: (prev.featuresSections || []).filter(
                  (_, sectionIdx) => sectionIdx !== 0
                ),
              }));

              if ((productData.featuresSections || []).length === 1) {
                setSelectedBannerType(null);
              }
            }}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            × Remove
          </button>
        </div>

        <div className="flex-1 p-6">
          <div className="flex gap-6 h-full">
            <div
              className="flex-1 overflow-y-auto pr-2 hide-scrollbar"
              style={{ width: "70%", maxHeight: "calc(100vh - 280px)" }}
            >
              <div className="space-y-8">
                {(productData.featuresSections || []).map(
                  (currentSection, idx) => (
                    <div key={idx}>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-md text-[#000000] font-semibold">
                              Banner {idx + 1}
                            </span>
                            <span className="text-sm text-[#00000099] text-xs ">
                              (
                              {currentSection.layout === "split"
                                ? currentSection.imagePosition === "right"
                                  ? "Right split image"
                                  : "Left split image"
                                : currentSection.mediaType === "video"
                                ? "Full width video"
                                : "Full width image"}
                              )
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setProductData((prev) => ({
                                ...prev,
                                featuresSections: (
                                  prev.featuresSections || []
                                ).filter((_, sectionIdx) => sectionIdx !== idx),
                              }));

                              if (
                                (productData.featuresSections || []).length ===
                                1
                              ) {
                                setSelectedBannerType(null);
                              }
                            }}
                            className="flex items-center gap-1 text-[#F82134] hover:text-[#F82134] text-sm font-medium transition-colors"
                          >
                            <img
                              src="/icons/close-line.svg"
                              alt="Remove"
                              className="w-4 h-4"
                            />
                            Remove
                          </button>
                        </div>
                      </div>

                      <div
                        className={`rounded-lg text-center mb-6 h-64 flex flex-col justify-center cursor-pointer hover:opacity-80 transition-opacity ${
                          currentSection.mediaFile || currentSection.mediaUrl
                            ? "border-2 border-solid border-gray-200"
                            : "border-2 border-dashed border-gray-400"
                        }`}
                        style={{ backgroundColor: "#FBFBFB" }}
                        onClick={() =>
                          document
                            .getElementById(`banner-file-input-${idx}`)
                            ?.click()
                        }
                      >
                        {currentSection.mediaFile || currentSection.mediaUrl ? (
                          <div className="relative w-full h-full group">
                            {currentSection.mediaType === "video" ? (
                              currentSection.mediaFile ? (
                                <video
                                  src={URL.createObjectURL(
                                    currentSection.mediaFile
                                  )}
                                  className="w-full h-full object-cover rounded"
                                  controls
                                />
                              ) : (
                                <video
                                  src={currentSection.mediaUrl}
                                  className="w-full h-full object-cover rounded"
                                  controls
                                />
                              )
                            ) : currentSection.mediaFile ? (
                              <img
                                src={URL.createObjectURL(
                                  currentSection.mediaFile
                                )}
                                alt="Banner"
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <img
                                src={currentSection.mediaUrl}
                                alt="Banner"
                                className="w-full h-full object-cover rounded"
                              />
                            )}
                            <div
                              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded flex flex-col items-center justify-center"
                              style={{
                                background:
                                  "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 100%)",
                              }}
                            >
                              <img
                                src="/icons/addmore.svg"
                                alt="Add more"
                                className="w-8 h-8 mb-2"
                              />
                              <p className="text-white text-[14px] font-semibold mb-1">
                                Replace content
                              </p>
                              <p className="text-white/80 text-xs">
                                {currentSection.layout === "split"
                                  ? "2:1 ratio"
                                  : "21:9 ratio"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="mb-0 flex items-center justify-center">
                              <img
                                src="/icons/addmore.svg"
                                alt="Add media"
                                className="w-12 h-12"
                              />
                            </div>
                            <p
                              className="mb-0"
                              style={{
                                color: "#000000CC",
                                fontSize: "14px",
                                fontWeight: 600,
                              }}
                            >
                              Upload {currentSection.mediaType}
                            </p>
                            <p
                              className="text-sm"
                              style={{ color: "#676767", fontSize: "12px" }}
                            >
                              {currentSection.layout === "split"
                                ? "2:1 ratio"
                                : "21:9 ratio"}
                            </p>
                            <input
                              type="file"
                              className="hidden"
                              id={`banner-file-input-${idx}`}
                              accept={
                                currentSection.mediaType === "video"
                                  ? "video/*"
                                  : "image/*"
                              }
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  updateMultiFeatureMedia(idx, file);
                                }
                              }}
                            />
                          </>
                        )}
                      </div>

                      <div className="space-y-4">
                        {currentSection.layout === "split" && (
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Heading
                              </label>
                              <input
                                type="text"
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                placeholder="Enter headline"
                                value={currentSection.title || ""}
                                onChange={(e) =>
                                  updateMultiFeature &&
                                  updateMultiFeature(
                                    idx,
                                    "title",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">
                                Description
                              </label>
                              <textarea
                                rows={3}
                                className="w-full border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                                placeholder="Write a short description"
                                value={currentSection.description || ""}
                                onChange={(e) =>
                                  updateMultiFeature &&
                                  updateMultiFeature(
                                    idx,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <div
              className="overflow-y-auto hide-scrollbar"
              style={{ width: "30%", maxHeight: "calc(100vh - 280px)" }}
            >
              <div className="bg-gray-50 rounded-lg px-1 py-1">
                <div className="mb-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Add feature banners :
                  </h4>

                  <div className="grid grid-cols-2 gap-0 mb-4">
                    <div
                      className={`flex flex-col items-center py-6 px-2 border rounded cursor-pointer transition bg-white border-gray-200 hover:border-gray-300`}
                      onClick={() => handleBannerTypeSelect("full-width-video")}
                    >
                      <div
                        className="w-12 h-6 border rounded mb-1 flex items-center justify-center"
                        style={{
                          backgroundColor: "#3573BA29",
                          borderColor: "#3573BA",
                        }}
                      >
                        <img
                          src="/icons/addbannervideo.svg"
                          alt=""
                          className="w-3 h-3"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-800">
                          Full width video
                        </p>
                        <p className="text-xs text-gray-500">21:9 ratio</p>
                      </div>
                    </div>

                    <div
                      className={`flex flex-col items-center py-6 px-2 border rounded cursor-pointer transition bg-white border-gray-200 hover:border-gray-300`}
                      onClick={() => handleBannerTypeSelect("full-width-image")}
                    >
                      <div
                        className="w-12 h-6 border rounded mb-1 flex items-center justify-center"
                        style={{
                          backgroundColor: "#3573BA29",
                          borderColor: "#3573BA",
                        }}
                      >
                        <img
                          src="/icons/addbannerimage.svg"
                          alt=""
                          className="w-3 h-3"
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-800">
                          Full width image
                        </p>
                        <p className="text-xs text-gray-500">21:9 ratio</p>
                      </div>
                    </div>

                    <div
                      className={`flex flex-col items-center py-6 px-2 border rounded cursor-pointer transition bg-white border-gray-200 hover:border-gray-300`}
                      onClick={() =>
                        handleBannerTypeSelect("right-split-image")
                      }
                    >
                      <div
                        className="w-12 h-6 border rounded mb-1 flex"
                        style={{ borderColor: "#3573BA" }}
                      >
                        <div className="w-1/2 bg-white"></div>
                        <div
                          className="w-1/2 flex items-center justify-center"
                          style={{ backgroundColor: "#3573BA29" }}
                        >
                          <img
                            src="/icons/addbannerimage.svg"
                            alt=""
                            className="w-3 h-3"
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-800">
                          Right split image
                        </p>
                        <p className="text-xs text-gray-500">2:1 ratio</p>
                      </div>
                    </div>

                    <div
                      className={`flex flex-col items-center py-6 px-2 border rounded cursor-pointer transition bg-white border-gray-200 hover:border-gray-300`}
                      onClick={() => handleBannerTypeSelect("left-split-image")}
                    >
                      <div
                        className="w-12 h-6 border rounded mb-1 flex"
                        style={{ borderColor: "#3573BA" }}
                      >
                        <div
                          className="w-1/2 flex items-center justify-center"
                          style={{ backgroundColor: "#6D0D2629" }}
                        >
                          <img
                            src="/icons/addbannerimage.svg"
                            alt=""
                            className="w-3 h-3"
                          />
                        </div>
                        <div className="w-1/2 bg-white"></div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-800">
                          Left split image
                        </p>
                        <p className="text-xs text-gray-500">2:1 ratio</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-0">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">
                    Reorder banners
                  </h4>
                  <div
                    className="overflow-y-auto hide-scrollbar pr-1"
                    style={{ maxHeight: "260px" }}
                  >
                    <div className="bg-white rounded-lg">
                      {(productData.featuresSections || []).map(
                        (section, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-3 p-3 text-xs ${
                              idx !==
                              (productData.featuresSections || []).length - 1
                                ? ""
                                : ""
                            }`}
                            draggable
                            onDragStart={() => handleBannerDragStart(idx)}
                            onDragEnter={() => handleBannerDragEnter(idx)}
                            onDragOver={handleBannerDragOver}
                            onDrop={() => handleBannerDrop(idx)}
                            onDragEnd={handleBannerDragEnd}
                            style={
                              dragOverBannerIndex === idx
                                ? {
                                    backgroundColor: "#F9FAFB",
                                    borderRadius: "6px",
                                  }
                                : {}
                            }
                          >
                            <div className="w-4 h-4 flex items-center justify-center cursor-move">
                              <img
                                src="/icons/6dots.svg"
                                alt="Drag"
                                className="w-3 h-3"
                              />
                            </div>
                            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {section.mediaFile || section.mediaUrl ? (
                                section.mediaType === "video" ? (
                                  section.mediaFile ? (
                                    <video
                                      src={URL.createObjectURL(
                                        section.mediaFile
                                      )}
                                      className="w-full h-full object-cover"
                                      muted
                                    />
                                  ) : (
                                    <video
                                      src={section.mediaUrl}
                                      className="w-full h-full object-cover"
                                      muted
                                    />
                                  )
                                ) : section.mediaFile ? (
                                  <img
                                    src={URL.createObjectURL(section.mediaFile)}
                                    alt="Banner thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img
                                    src={section.mediaUrl}
                                    alt="Banner thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                )
                              ) : section.mediaType === "video" ? (
                                <img
                                  src="/icons/addbannervideo.svg"
                                  alt=""
                                  className="w-8 h-8"
                                />
                              ) : (
                                <img
                                  src="/icons/addbannerimage.svg"
                                  alt=""
                                  className="w-8 h-8"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800">
                                Banner {idx + 1}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {section.layout === "split"
                                  ? section.imagePosition === "right"
                                    ? "Right split image"
                                    : "Left split image"
                                  : section.mediaType === "video"
                                  ? "Full width video"
                                  : "Full width image"}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductFeaturesSection;
