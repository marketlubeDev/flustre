"use client";
import { useState, useMemo } from "react";
import Head from "next/head";
// import useInstaCarousel from "@/lib/hooks/useInstaCarousel"; // Removed API integration

export default function InstagramPage() {
  const [playingVideo, setPlayingVideo] = useState(null);

  const handlePlayClick = (videoId) => {
    setPlayingVideo(videoId);
  };

  const handleVideoEnd = () => {
    setPlayingVideo(null);
  };

  const handleMouseEnter = (videoId) => {
    setPlayingVideo(videoId);
  };

  const handleMouseLeave = () => {
    setPlayingVideo(null);
  };

  // Static data - no API integration
  const data = null;
  const isLoading = false;
  const isError = false;

  // Static fallback videos from public/featured/insta
  const staticVideoData = useMemo(
    () => [
      {
        id: "static-1",
        thumbnail: "/placeholder-thumbnail.jpg",
        video: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/videos/insta1+(1).mp4",
        alt: "Instagram Video 1",
      },
      {
        id: "static-2",
        thumbnail: "/placeholder-thumbnail.jpg",
        video: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/videos/insta2+(1).mp4",
        alt: "Instagram Video 2",
      },
      {
        id: "static-3",
        thumbnail: "/placeholder-thumbnail.jpg",
        video: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/videos/insta3+(1).mp4",
        alt: "Instagram Video 3",
      },
      {
        id: "static-4",
        thumbnail: "/placeholder-thumbnail.jpg",
        video: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/videos/insta4+(1).mp4",
        alt: "Instagram Video 4",
      },
      {
        id: "static-5",
        thumbnail: "/placeholder-thumbnail.jpg",
        video: "https://marketlube-ecommerce.s3.ap-south-1.amazonaws.com/Flustre/videos/insta5+(1).mp4",
        alt: "Instagram Video 5",
      },
    ],
    []
  );

  const apiVideoData = useMemo(() => {
    const apiItems = data?.data || [];
    return apiItems.map((item) => ({
      id: item._id,
      thumbnail: item.thumbnailUrl || "/placeholder-thumbnail.jpg",
      video: item.videoUrl,
      alt: item.title || "Instagram Video",
    }));
  }, [data]);

  // Prefer API results when available, otherwise fall back to static videos
  const videoData = apiVideoData.length > 0 ? apiVideoData : staticVideoData;

  const shouldDuplicate = videoData.length >= 6;

  const VideoThumbnail = ({ data, isInteractive = true }) => (
    <div
      className="relative flex-shrink-0 rounded-lg overflow-hidden w-[180px] h-[320px] sm:w-[200px] sm:h-[360px] md:w-[220px] md:h-[400px] lg:w-[253px] lg:h-[450px] cursor-pointer transition-transform duration-300 hover:scale-105"
      style={{
        aspectRatio: "122/217",
      }}
      onMouseEnter={isInteractive ? () => handleMouseEnter(data.id) : undefined}
      onMouseLeave={isInteractive ? handleMouseLeave : undefined}
    >
      {/* Always render the video element; autoplay only when active */}
      <video
        src={data.video}
        className="w-full h-full object-cover"
        autoPlay={isInteractive && playingVideo === data.id}
        muted
        onEnded={handleVideoEnd}
        loop
        playsInline
        preload="metadata"
      />
      {/* Play Button Overlay (shown when not actively playing) */}
      {isInteractive && playingVideo !== data.id && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-white transition-all duration-200 hover:scale-110"
            onClick={() => handlePlayClick(data.id)}
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-gray-800 ml-0.5 sm:ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );

  // Hide section when API returns an empty list
  if (!isLoading && !isError && videoData.length === 0) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Follow us on Instagram</title>
        <meta
          name="description"
          content="Check out our latest Instagram videos and follow us for more content"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div>
        <div
          className="flex flex-col items-center justify-center w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16 overflow-hidden"
          style={{
            background: "rgba(241, 132, 8, 0.05)",
          }}
        >
          <h1
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight mb-8 md:mb-12"
            style={{
              color: "#333333",
              textAlign: "center",
            }}
          >
            Follow us on{" "}
            <span className="text-[var(--color-primary)]">
              Instagram
            </span>
          </h1>

          {/* Auto Scrolling Instagram Thumbnails */}
          <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
            <style jsx global>{`
              @keyframes scroll-left {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }

              .auto-scroll {
                animation: scroll-left 30s linear infinite;
                width: calc(200% + 24px);
              }

              .auto-scroll:hover {
                animation-play-state: paused;
              }

              @media (prefers-reduced-motion: reduce) {
                .auto-scroll {
                  animation: none;
                }
              }

              /* Responsive improvements */
              @media (max-width: 640px) {
                .auto-scroll {
                  animation-duration: 25s;
                }
              }

              @media (min-width: 1024px) {
                .auto-scroll {
                  animation-duration: 35s;
                }
              }
            `}</style>

            <div
              className={`flex gap-3 sm:gap-4 md:gap-5 ${
                shouldDuplicate ? "auto-scroll" : ""
              }`}
            >
              {/* Original thumbnails */}
              {isLoading && (
                <div className="text-center py-8 w-full">Loading...</div>
              )}
              {isError && apiVideoData.length === 0 && (
                <div className="text-center py-8 w-full">Showing featured videos.</div>
              )}
              {!isLoading &&
                videoData.map((data) => (
                  <VideoThumbnail
                    key={data.id}
                    data={data}
                    isInteractive={true}
                  />
                ))}

              {/* Duplicate thumbnails for seamless infinite scroll */}
              {shouldDuplicate &&
                !isLoading &&
                videoData.map((data) => (
                  <VideoThumbnail
                    key={`${data.id}-duplicate`}
                    data={data}
                    isInteractive={false}
                  />
                ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-8 md:mt-12 text-center"></div>
        </div>
      </div>
    </>
  );
}
