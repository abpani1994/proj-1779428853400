// AnimatedBeam — animated SVG line connecting two refs.
// Use for "AI flow" diagrams, integrations, connection visualizations.

//
// Usage:
//   const containerRef = useRef(null);
//   const fromRef = useRef(null);
//   const toRef = useRef(null);
//   return (
//     <div ref={containerRef} className="relative">
//       <div ref={fromRef}>Source</div>
//       <div ref={toRef}>Target</div>
//       <AnimatedBeam containerRef={containerRef} fromRef={fromRef} toRef={toRef} />
//     </div>
//   );

import * as React from "react";
import { useEffect, useId, useRef, useState } from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 5,
  delay = 0,
  pathColor = "gray",
  pathWidth = 2,
  pathOpacity = 0.2,
  gradientStartColor = "#ffaa40",
  gradientStopColor = "#9c40ff",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}) {
  const id = useId();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const gradientCoordinates = reverse
    ? { x1: ["90%", "-10%"], x2: ["100%", "0%"], y1: ["0%", "0%"], y2: ["0%", "0%"] }
    : { x1: ["10%", "110%"], x2: ["0%", "100%"], y1: ["0%", "0%"], y2: ["0%", "0%"] };

  useEffect(() => {
    const update = () => {
      if (!containerRef?.current || !fromRef?.current || !toRef?.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();
      const width = containerRect.width;
      const height = containerRect.height;
      setSvgDimensions({ width, height });
      const startX = fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
      const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;
      const controlY = startY - curvature;
      setPathD(`M ${startX},${startY} Q ${(startX + endX) / 2},${controlY} ${endX},${endY}`);
    };
    update();
    const ro = new ResizeObserver(update);
    if (containerRef?.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [containerRef, fromRef, toRef, curvature, startXOffset, startYOffset, endXOffset, endYOffset]);

  return (
    <svg
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("pointer-events-none absolute left-0 top-0 transform-gpu stroke-2", className)}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
    >
      <path d={pathD} stroke={pathColor} strokeWidth={pathWidth} strokeOpacity={pathOpacity} strokeLinecap="round" />
      <path d={pathD} stroke={`url(#${id})`} strokeWidth={pathWidth} strokeOpacity={1} strokeLinecap="round" />
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse">
          <stop stopColor={gradientStartColor} stopOpacity={0}>
            <animate attributeName="offset" from="-10%" to="110%" dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`} />
          </stop>
          <stop stopColor={gradientStartColor}>
            <animate attributeName="offset" from="-5%" to="115%" dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`} />
          </stop>
          <stop stopColor={gradientStopColor}>
            <animate attributeName="offset" from="0%" to="120%" dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`} />
          </stop>
          <stop stopColor={gradientStopColor} stopOpacity={0}>
            <animate attributeName="offset" from="5%" to="125%" dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`} />
          </stop>
        </linearGradient>
      </defs>
    </svg>
  );
}