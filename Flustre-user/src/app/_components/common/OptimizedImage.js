"use client";

import { useState } from "react";
import Image from "next/image";

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = "",
  sizes,
  priority = false,
  placeholder = "Product Image",
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Use a placeholder image with appropriate dimensions
      const placeholderUrl = `https://via.placeholder.com/${width || 300}x${height || 300}?text=${encodeURIComponent(placeholder)}`;
      setImageSrc(placeholderUrl);
    }
  };

  const isS3Image = src?.includes('amazonaws.com') || src?.includes('marketlube');

  // For S3 images, use a regular img tag to avoid Next.js optimization issues
  if (isS3Image) {
    return (
      <img
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}}
        {...props}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={handleError}
      {...props}
    />
  );
} 