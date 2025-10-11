import React from "react";

const Button = ({
  children,
  variant = "primary",
  size = "medium",
  type = "button",
  disabled = false,
  loading = false,
  onClick,
  className = "",
  leftIcon,
  rightIcon,
  ...props
}) => {
  // Base button classes
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant classes
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500/50",
    outline:
      "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50",
    success:
      "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500/50",
    warning:
      "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-500/50",
    ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-500/50",
    // Gradient rose variant used for Add Coupon
    gradientRose:
      "rounded-[8px] border-b border-[#B3536C] text-white shadow-[0_1px_2px_0_rgba(189,93,118,0.69)] bg-gradient-to-b from-[#6D0D26] to-[#A94962] hover:opacity-95 focus:ring-[#A94962]/50",
    // Export button variant with light pink background and dark text
    exportButton:
      "bg-pink-100 text-[#6D0D26] border border-pink-200 hover:bg-pink-200 hover:text-[#5A0B21] focus:ring-pink-300/50 transition-all duration-200",
  };

  // Size classes
  const sizeClasses = {
    small: "px-3 py-1.5 text-sm",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base",
  };

  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={buttonClasses}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {leftIcon && (
        <span className="mr-2 inline-flex items-center">{leftIcon}</span>
      )}
      {children}
      {rightIcon && (
        <span className="ml-2 inline-flex items-center">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
