// SpotlightCard.jsx — cursor-tracked highlight on a flat card.

//
// USAGE
//   <SpotlightCard className="p-6">…</SpotlightCard>                   // radial
//   <SpotlightCard variant="edge" className="p-6">…</SpotlightCard>    // edge-glow
//   <SpotlightCard variant="lift" className="p-6">…</SpotlightCard>    // radial + lift
//
// Gracefully degrades:
//   • Touch / coarse pointer — no spotlight, just a normal card.
//   • Reduced-motion — no transition, just a static card.

import * as React from "react";
import { useRef } from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

const isHoverable = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;

const VARIANT_CLASS = {
  radial: "spotlight-card--radial",
  edge:   "spotlight-card--edge",
  lift:   "spotlight-card--lift",
};

export default function SpotlightCard({
  as: Tag = "div",
  variant = "radial",
  size = 320,
  intensity = 0.16,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);

  function handleMove(e) {
    const el = ref.current;
    if (!el || !isHoverable()) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--sx", `${e.clientX - r.left}px`);
    el.style.setProperty("--sy", `${e.clientY - r.top}px`);
  }

  const vClass = VARIANT_CLASS[variant] || VARIANT_CLASS.radial;

  return (
    <Tag
      ref={ref}
      onPointerMove={handleMove}
      style={{ "--spot-size": `${size}px`, "--spot-alpha": intensity }}
      className={cn(
        "card spotlight-card relative isolate overflow-hidden",
        vClass,
        "backdrop-blur-sm",
        "transition-all duration-300",
        className,
      )}
      {...rest}
    >
      <span className="spotlight-card__highlight" aria-hidden />
      <span className="relative z-10 block">{children}</span>
    </Tag>
  );
}