// SmoothScrollProvider — Lenis wrapper with luxury defaults.

//
// USAGE
//   import SmoothScrollProvider from "./components/SmoothScrollProvider";
//   <SmoothScrollProvider>
//     <Routes>…</Routes>
//   </SmoothScrollProvider>
//
// Behavior:
//   • Disabled when prefers-reduced-motion: reduce.
//   • Honors data-lenis-prevent on any element you don't want intercepted
//     (e.g., scroll-snap containers, modal scroll areas).
//   • Uses lerp 0.08 + duration 1.2s — the premium-feeling defaults that
//     darkroom.engineering / Studio Freight ship.

import * as React from "react";
import { useEffect, useRef } from "react";

export default function SmoothScrollProvider({ children }) {
  const rafRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduced) return;

    let lenis;
    let disposed = false;

    (async () => {
      try {
        const mod = await import("lenis");
        if (disposed) return;
        const Lenis = mod.default || mod.Lenis || mod;
        lenis = new Lenis({
          lerp: 0.08,
          duration: 1.2,
          smoothWheel: true,
          smoothTouch: false,
          // Honor scroll-snap zones and modal scrollers.
          prevent: (node) => node.hasAttribute?.("data-lenis-prevent"),
        });
        const raf = (time) => { lenis.raf(time); rafRef.current = requestAnimationFrame(raf); };
        rafRef.current = requestAnimationFrame(raf);
      } catch (e) {
        // Lenis not installed (older project, or sandboxed build) — silently
        // fall back to native scrolling. App still works.
        if (typeof console !== "undefined") console.warn("[smooth-scroll] lenis unavailable:", e?.message);
      }
    })();

    return () => {
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      if (lenis) lenis.destroy?.();
    };
  }, []);

  return children;
}