import React from "react";

function FeatureBannersPicker({ onSelect }) {
  return (
    <div className="h-full">
      <div className="px-0 py-0 bg-white rounded-lg h-full flex flex-col">
        <h2 className="text-sm font-semibold bg-[#6D0D261A] text-[#6D0D26] px-4 py-3 rounded-t-lg">
          PRODUCT FEATURES
        </h2>

        <div className="flex-1 px-3 py-8 flex flex-col justify-center items-center">
          <div className="text-center mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Add feature banners :
            </h3>
          </div>

          <div className="flex justify-around w-full items-center">
            <div className="flex justify-center items-center gap-6 w-full">
              {/* Full width video */}
              <div
                className="flex flex-col items-center px-6 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onSelect && onSelect("full-width-video")}
              >
                <div
                  className="w-32 h-12 border rounded px-0.5 py-0.5 mb-2"
                  style={{ borderColor: "#6D0D26" }}
                >
                  <div
                    className="w-full h-full rounded flex items-center justify-center"
                    style={{ backgroundColor: "#6D0D2629" }}
                  >
                    <div className="flex items-center justify-center">
                      <img
                        src="/icons/addbannervideo.svg"
                        alt="Add banner video"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#000000CC]">
                    Full width video
                  </p>
                  <p className="text-xs text-[#999999]">21:9 ratio</p>
                </div>
              </div>

              {/* Separator */}
              <div
                className="h-20 w-px"
                style={{ backgroundColor: "#E5ECF8" }}
              ></div>

              {/* Full width image */}
              <div
                className="flex flex-col items-center px-6 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onSelect && onSelect("full-width-image")}
              >
                <div
                  className="w-32 h-12 border rounded px-0.5 py-0.5 mb-2"
                  style={{ borderColor: "#6D0D26" }}
                >
                  <div
                    className="w-full h-full rounded flex items-center justify-center"
                    style={{ backgroundColor: "#6D0D2629" }}
                  >
                    <div className="flex items-center justify-center">
                      <img
                        src="/icons/addbannerimage.svg"
                        alt="Add banner image"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#000000CC]">
                    Full width image
                  </p>
                  <p className="text-xs text-[#999999]">21:9 ratio</p>
                </div>
              </div>

              {/* Separator */}
              <div
                className="h-20 w-px"
                style={{ backgroundColor: "#E5ECF8" }}
              ></div>

              {/* Right split image */}
              <div
                className="flex flex-col items-center px-6 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onSelect && onSelect("right-split-image")}
              >
                <div
                  className="w-32 h-12 border rounded px-0.5 py-0.5 mb-2"
                  style={{ borderColor: "#6D0D26" }}
                >
                  <div className="w-full h-full rounded flex">
                    <div className="w-1/2 bg-white rounded-l flex items-center justify-center"></div>
                    <div
                      className="w-1/2 rounded-r flex items-center justify-center"
                      style={{ backgroundColor: "#6D0D2629" }}
                    >
                      <img
                        src="/icons/addbannerimage.svg"
                        alt="Right positioned banner"
                        className="w-6 h-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#000000CC]">
                    Right split image
                  </p>
                  <p className="text-xs text-[#999999]">2:1 ratio</p>
                </div>
              </div>

              {/* Separator */}
              <div
                className="h-20 w-px"
                style={{ backgroundColor: "#E5ECF8" }}
              ></div>

              {/* Left split image */}
              <div
                className="flex flex-col items-center px-6 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onSelect && onSelect("left-split-image")}
              >
                <div
                  className="w-32 h-12 border rounded px-0.5 py-0.5 mb-2"
                  style={{ borderColor: "#6D0D26" }}
                >
                  <div className="w-full h-full rounded flex">
                    <div
                      className="w-1/2 rounded-l flex items-center justify-center"
                      style={{ backgroundColor: "#6D0D2629" }}
                    >
                      <img
                        src="/icons/addbannerimage.svg"
                        alt="Left positioned banner"
                        className="w-6 h-6"
                      />
                    </div>
                    <div className="w-1/2 bg-white rounded-r flex items-center justify-center"></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-[#000000CC]">
                    Left split image
                  </p>
                  <p className="text-xs text-[#999999]">2:1 ratio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeatureBannersPicker;
