// StatCounter.jsx — spring-physics number ticker.

//
// USAGE
//   <StatCounter value={12847} suffix="+" className="text-5xl font-bold text-gradient" />
//   <StatCounter value={4.9} decimalPlaces={1} suffix="/5" />
//
// Internally uses framer-motion's useSpring for smoother digit transitions
// than the raw IntersectionObserver-based NumberTicker.

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function StatCounter({
  value = 0,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  className,
  delay = 0,
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const mv = useMotionValue(0);
  // damping: 60 / stiffness: 80 = ~1.4s settle, no bounce — premium ticker feel.
  const spring = useSpring(mv, { damping: 60, stiffness: 80, mass: 1 });
  const display = useTransform(spring, (n) =>
    Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(n.toFixed(decimalPlaces)))
  );

  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => mv.set(value), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, value, delay, mv]);

  return (
    <span ref={ref} className={cn("count-up text-gradient inline-block tabular-nums", className)}>
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}