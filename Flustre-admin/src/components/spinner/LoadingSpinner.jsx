import React from "react";

const SIZES = {
  xs: "h-4 w-4 border-2",
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-2",
  lg: "h-16 w-16 border-4",
  xl: "h-24 w-24 border-4",
};

const COLORS = {
  primary: "border-blue-500",
  secondary: "border-gray-500",
  success: "border-green-500",
  danger: "border-red-500",
  warning: "border-yellow-500",
};

function LoadingSpinner({
  fullScreen = false,
  size = "md",
  color = "primary",
  showText = true,
  text = "Loading...",
  className = "",
  containerClassName = "",
}) {
  const sizeClass = SIZES[size] || SIZES.md;
  const colorClass = COLORS[color] || COLORS.primary;

  const spinner = (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-transparent ${sizeClass} ${colorClass}`}
      ></div>
      {showText && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-75 z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center p-4 ${containerClassName}`}
    >
      {spinner}
    </div>
  );
}

export default LoadingSpinner;
