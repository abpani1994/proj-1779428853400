// motion-presets.js
// Pre-installed by godmode. Reference these by name — never inline transition objects.
//
// USAGE
//   import { fadeUp, staggerContainer, cardHover } from "@/lib/motion-presets";
//   <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-15%" }}>
//     <motion.h1 variants={fadeUp}>Headline</motion.h1>
//   </motion.div>

// Curated easing tokens — match the CSS vars in index.css (--ease-*).
// Cubic-bezier here because framer-motion can't read CSS vars in JS.
export const ease = {
  entrance: [0.16, 1, 0.3, 1],    // expo-out — heroes, modals, big reveals
  hover:    [0.22, 1, 0.36, 1],   // quart-out — micro-interactions
  morph:    [0.65, 0, 0.35, 1],   // in-out-cubic — FLIP / shared elements
  exit:     [0.7, 0, 0.84, 0],    // quart-in — exits ONLY
};

// Spring presets. damping < 18 = bouncy / cheap. Never go there.
export const spring = {
  hover:  { type: "spring", stiffness: 200, damping: 30, mass: 1 },
  sheet:  { type: "spring", stiffness: 120, damping: 26, mass: 1.1 },
  snappy: { type: "spring", stiffness: 400, damping: 40, mass: 1 },
  soft:   { type: "spring", stiffness: 150, damping: 28, mass: 1 },
};

// ── Entrance variants ──
export const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: ease.entrance } },
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: ease.entrance } },
};

export const slideInLeft = {
  hidden:  { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: ease.entrance } },
};

export const slideInRight = {
  hidden:  { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: ease.entrance } },
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: ease.entrance } },
};

// Reveal-mask — clip-path-driven reveal, runs the full duration even on slow networks.
export const revealMask = {
  hidden:  { clipPath: "inset(100% 0 0 0)" },
  visible: { clipPath: "inset(0% 0 0 0)", transition: { duration: 0.9, ease: ease.entrance } },
};

// ── Stagger orchestration ──
export const staggerContainer = {
  hidden:  {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export const staggerContainerFast = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.035 } },
};

// Character/word-level reveal — pair with a split-text utility.
export const splitChars = {
  hidden:  { opacity: 0, y: "30%" },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: ease.entrance } },
};

// ── Hover / tap states ──
// Cards: ALWAYS use 1.015 / 1.02 — never 1.05. Cheap-looking.
export const cardHover = {
  whileHover: { y: -3, scale: 1.015, transition: spring.hover },
  whileTap:   { scale: 0.985, transition: spring.snappy },
};

export const buttonHover = {
  whileHover: { y: -1, transition: spring.hover },
  whileTap:   { scale: 0.97, transition: spring.snappy },
};

// Subtle floating treatment for hero figures.
export const breathe = {
  animate: {
    y: [0, -6, 0],
    transition: { duration: 6, ease: ease.entrance, repeat: Infinity, repeatType: "loop" },
  },
};

// ── Layout / shared-element transitions ──
export const layoutSpring = spring.soft;

// ── Sheet / modal presets ──
export const sheetUp = {
  hidden:  { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: spring.sheet },
  exit:    { opacity: 0, y: 40, transition: { duration: 0.25, ease: ease.exit } },
};

// Helper: respect prefers-reduced-motion — wrap variants to skip transforms.
export function reduceMotion(variants) {
  if (typeof window === "undefined") return variants;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (!reduced) return variants;
  return Object.fromEntries(
    Object.entries(variants).map(([k, v]) => [k, { ...v, transition: { duration: 0.01 } }])
  );
}
