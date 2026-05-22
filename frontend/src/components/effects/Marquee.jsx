// Marquee — auto-scrolling horizontal row with gradient-faded edges.
// Use for logo strips, testimonials, infinite features.

//
// Usage:
//   <Marquee pauseOnHover>
//     {logos.map(l => <img key={l.id} src={l.src} alt={l.name} />)}
//   </Marquee>

import * as React from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
      style={{
        maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)] animate-marquee", {
              "animate-marquee-vertical flex-col": vertical,
              "flex-row": !vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}