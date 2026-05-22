// Skeleton.jsx — loading skeleton with mood-styled .shimmer.

//
// USAGE
//   <Skeleton w="100%" h="2rem" />                          // rect
//   <Skeleton variant="text" lines={3} />                   // 3 text lines
//   <Skeleton variant="circle" size="48px" />               // avatar
//   <Skeleton variant="card" className="aspect-video" />    // card

import * as React from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function Skeleton({
  variant = "rect",
  w,
  h,
  size,
  lines = 1,
  className = "",
  style,
  ...rest
}) {
  if (variant === "text") {
    return (
      <div className={cn("space-y-2", className)} {...rest} role="status" aria-label="Loading">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="shimmer h-3 rounded"
            style={{ width: i === lines - 1 ? "70%" : "100%" }}
          />
        ))}
      </div>
    );
  }
  if (variant === "circle") {
    return (
      <div
        className={cn("shimmer rounded-full", className)}
        style={{ width: size || "48px", height: size || "48px", ...style }}
        role="status"
        aria-label="Loading"
        {...rest}
      />
    );
  }
  if (variant === "card") {
    return (
      <div
        className={cn("shimmer rounded-2xl", className)}
        style={{ width: w || "100%", height: h || "200px", ...style }}
        role="status"
        aria-label="Loading"
        {...rest}
      />
    );
  }
  // default: rect
  return (
    <div
      className={cn("shimmer rounded", className)}
      style={{ width: w || "100%", height: h || "1rem", ...style }}
      role="status"
      aria-label="Loading"
      {...rest}
    />
  );
}