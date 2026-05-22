// MagneticCard — pointer-tracked tilt + radial glow.

//
// USAGE
//   <MagneticCard className="card p-6">
//     <h3>Feature</h3>
//     <p>Description</p>
//   </MagneticCard>
//
// Gracefully degrades on touch + reduced-motion: just renders a static card.

import * as React from "react";
import { useRef } from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

const isReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

const isHoverable = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;

export default function MagneticCard({
  as: Tag = "div",
  intensity = 6,        // max tilt in degrees
  glow = true,
  className = "",
  children,
  ...rest
}) {
  const ref = useRef(null);

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    if (isReducedMotion() || !isHoverable()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;   // 0..1
    const y = (e.clientY - r.top) / r.height;
    const rx = (0.5 - y) * intensity;
    const ry = (x - 0.5) * intensity;
    el.style.setProperty("--mx-card", `${e.clientX - r.left}px`);
    el.style.setProperty("--my-card", `${e.clientY - r.top}px`);
    el.style.setProperty("--rx-card", `${rx}deg`);
    el.style.setProperty("--ry-card", `${ry}deg`);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx-card", "0deg");
    el.style.setProperty("--ry-card", "0deg");
  }

  return (
    <Tag
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      data-glow={glow ? "true" : "false"}
      className={cn("magnetic-card card magnetic", className)}
      {...rest}
    >
      <span className="magnetic-card__glow" aria-hidden />
      <span className="magnetic-card__content">{children}</span>
    </Tag>
  );
}