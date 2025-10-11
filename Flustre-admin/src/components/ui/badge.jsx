import React from "react";

export function Badge({ className = "", variant = "default", children, ...props }) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const variants = {
    default: "bg-primary text-primary-foreground border-transparent",
    outline: "border-border bg-background text-foreground",
  };
  const classes = [base, variants[variant] || variants.default, className].filter(Boolean).join(" ");
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
} 