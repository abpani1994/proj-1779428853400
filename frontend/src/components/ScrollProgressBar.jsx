// ScrollProgressBar — top-of-page reading progress.

//
// USAGE
//   import ScrollProgressBar from "./components/ScrollProgressBar";
//   <ScrollProgressBar />

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgressBar({ height = 2 }) {
  const { scrollYProgress } = useScroll();
  // Soft spring tuning — never bouncy. damping: 30 / stiffness: 120.
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 1 });

  return (
    <motion.div
      aria-hidden
      style={{
        scaleX,
        transformOrigin: "0% 50%",
        height,
        backgroundImage:
          "linear-gradient(90deg, var(--brand) 0%, var(--accent) 100%)",
      }}
      className="fixed inset-x-0 top-0 z-[60] shine-sweep"
    />
  );
}