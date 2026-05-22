// PullQuote.jsx — editorial display quote, serif-italic, full-bleed-capable.

//
// USAGE
//   <PullQuote attribution="Sarah Chen, Designer at Linear">
//     It changed how I think about my day.
//   </PullQuote>
//
//   <PullQuote size="lg" bleed>
//     "{quote}"
//   </PullQuote>

import * as React from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

const SIZE_MAP = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-5xl",
  lg: "text-4xl md:text-6xl lg:text-7xl",
};

export default function PullQuote({
  children,
  attribution,
  size = "md",
  bleed = false,
  as: Tag = "blockquote",
  className = "",
  ...rest
}) {
  return (
    <figure className={cn("card relative", bleed && "py-16 md:py-24", className)}>
      <Tag
        className={cn(
          SIZE_MAP[size] || SIZE_MAP.md,
          "font-serif italic leading-[1.15] tracking-[-0.01em]",
          "max-w-4xl mx-auto text-center",
          "text-gradient",
        )}
        style={{ textWrap: "balance", fontOpticalSizing: "auto" }}
        {...rest}
      >
        <span className="opacity-30 mr-2" aria-hidden>"</span>
        {children}
        <span className="opacity-30 ml-2" aria-hidden>"</span>
      </Tag>
      {attribution && (
        <figcaption className="mt-6 text-center uppercase tracking-[0.22em] text-[11px] pill mx-auto w-fit text-[color:var(--text-2)]">
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}