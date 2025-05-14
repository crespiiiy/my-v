import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

export default function Logo({ size = "md", variant = "full" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  return (
    <div className={`${sizeClasses[size]} flex items-center`}>
      {/* Icon part of the logo */}
      <div className="relative">
        <svg
          viewBox="0 0 40 40"
          className={`${sizeClasses[size]} text-blue-500`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 5L30 15L20 25L10 15L20 5Z"
            fill="currentColor"
            fillOpacity="0.8"
          />
          <path
            d="M20 15L30 25L20 35L10 25L20 15Z"
            fill="currentColor"
            fillOpacity="0.6"
          />
          <path
            d="M25 10L35 20L25 30L15 20L25 10Z"
            fill="currentColor"
            fillOpacity="0.4"
          />
        </svg>
      </div>

      {/* Text part of the logo */}
      {variant === "full" && (
        <div className="ml-2 font-bold text-xl bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Creative
        </div>
      )}
    </div>
  );
} 