//
// Usage:
//   <NumberTicker value={12847} className="text-5xl font-bold" />

import * as React from "react";
import { useEffect, useRef, useState } from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function NumberTicker({
  value = 0,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  className,
}) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(direction === "down" ? value : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        const start = performance.now() + delay * 1000;
        const duration = 1400;
        const from = direction === "down" ? value : 0;
        const to = direction === "down" ? 0 : value;
        let raf;
        const tick = (now) => {
          if (now < start) { raf = requestAnimationFrame(tick); return; }
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 4); // easeOutQuart
          setDisplay(from + (to - from) * eased);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, direction, delay]);

  const formatted = Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(display.toFixed(decimalPlaces)));

  return <span ref={ref} className={cn("count-up text-gradient inline-block tabular-nums", className)}>{formatted}</span>;
}