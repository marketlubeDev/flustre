"use client";

export default function ProductVideoSection({ product }) {
  // Use API data if available, otherwise use static fallback
  const videoSections = product?.featuresSections?.filter(
    (section) => section.mediaType === "video" || section.layout === "video"
  ) || [
    {
      id: 1,
      title: "Product Demo Video",
      mediaUrl: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/videos/feature-video1+(1).mp4",
    }
  ];

  if (!videoSections || videoSections.length === 0) {
    return null;
  }

  return (
    <>
      {videoSections.map((video, index) => (
        <div key={video.id || index} className="my-8">
          <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white relative">
            <video
              src={video.mediaUrl || video.videoUrl}
              className="w-full object-cover object-center h-48 sm:h-64 md:h-80 lg:h-[600px]"
              controls
              poster={video.poster}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ))}
    </>
  );
}
