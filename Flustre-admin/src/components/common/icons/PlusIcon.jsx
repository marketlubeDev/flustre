import React from "react";

const PlusIcon = ({ className = "w-4 h-4", strokeWidth = 2 }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

export default PlusIcon;
