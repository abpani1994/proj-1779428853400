// MarqueeBand.jsx — slow editorial auto-scrolling band.

// (For logo strips use the existing <Marquee> from effects/Marquee.jsx.)
//
// Variants:
//   • "tight"    — small 1.5rem gap, dense reading rhythm
//   • "spacious" (default) — generous 4rem gap, magazine feel
//   • "split"    — alternating tall/short pill heights, more visual rhythm
//
// USAGE
//   <MarqueeBand pauseOnHover items={taglines} />                   // spacious
//   <MarqueeBand variant="tight" items={shortItems} />              // dense
//   <MarqueeBand variant="split" items={mixedItems} speed={80} />   // editorial
//   <MarqueeBand speed={50} reverse>{children}</MarqueeBand>

import * as React from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

const VARIANT_GAP = {
  tight: "1.5rem",
  spacious: "4rem",
  split: "3rem",
};

export default function MarqueeBand({
  children,
  items,
  variant = "spacious",
  speed,                  // seconds per full cycle; defaults vary per variant
  pauseOnHover = true,
  reverse = false,
  gap,
  fade = true,
  className = "",
}) {
  const resolvedGap = gap || VARIANT_GAP[variant] || VARIANT_GAP.spacious;
  const resolvedSpeed = speed ?? (variant === "tight" ? 45 : variant === "split" ? 80 : 60);
  const isSplit = variant === "split";
  const renderItems = items
    ? items.map((it, i) => (
        <span
          key={i}
          className={cn(
            "pill shrink-0",
            isSplit && (i % 2 === 0 ? "text-2xl md:text-3xl" : "text-lg md:text-xl opacity-70"),
          )}
        >
          {it}
        </span>
      ))
    : React.Children.toArray(children);

  return (
    <div
      className={cn(
        "marquee-band relative w-full overflow-hidden",
        "marquee-band--" + variant,
        fade && "[mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]",
        pauseOnHover && "group",
        className,
      )}
      data-direction={reverse ? "reverse" : "forward"}
      role="region"
      aria-label="Continuously scrolling banner"
    >
      <div
        className="marquee-band__track flex items-center"
        style={{
          gap: resolvedGap,
          "--marquee-duration": `${resolvedSpeed}s`,
          "--marquee-direction": reverse ? "reverse" : "normal",
          "--marquee-gap": resolvedGap,
        }}
      >
        {[0, 1].map((_, copy) => (
          <div
            key={copy}
            className="flex items-center shrink-0"
            style={{ gap: resolvedGap }}
            aria-hidden={copy === 1}
          >
            {renderItems}
          </div>
        ))}
      </div>
    </div>
  );
}