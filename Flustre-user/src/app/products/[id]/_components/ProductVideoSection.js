"use client";

export default function ProductVideoSection() {
  // Static video section
  const staticVideo = {
    id: 1,
    title: "Product Demo Video",
    videoUrl: "/feature-product/feature-video1.mp4",

  };

  return (
    <div className="my-8">
      <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white relative">
        <video
          src={staticVideo.videoUrl}
          className="w-full object-cover object-center h-48 sm:h-64 md:h-80 lg:h-[600px]"
          controls
          poster={staticVideo.poster}
        >
          Your browser does not support the video tag.
        </video>
        {/* Optionally, you can add a custom play button overlay if you want to control playback via JS */}
      </div>
    </div>
  );
}
