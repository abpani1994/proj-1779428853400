// BorderBeam — rotating gradient ring around an element.
// Place inside any container with position: relative and overflow: hidden.

//
// Usage:
//   <div className="relative overflow-hidden rounded-2xl">
//     <BorderBeam size={200} duration={12} colorFrom="#ff80ff" colorTo="#80ffff" />
//     ...content
//   </div>

import * as React from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function BorderBeam({
  className,
  size = 200,
  duration = 15,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = "#ffaa40",
  colorTo = "#9c40ff",
  delay = 0,
}) {
  return (
    <div
      style={{
        "--size": size,
        "--duration": duration + "s",
        "--anchor": anchor + "%",
        "--border-width": borderWidth + "px",
        "--color-from": colorFrom,
        "--color-to": colorTo,
        "--delay": "-" + delay + "s",
      }}
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        "![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]",
        "after:absolute after:aspect-square after:w-[calc(var(--size)*1px)] after:animate-border-beam after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor)*1%)_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)*1px))]",
        className,
      )}
    />
  );
}