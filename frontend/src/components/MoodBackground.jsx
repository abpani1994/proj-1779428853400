// MoodBackground — cursor-following Spotlight for Bento Showcase.

import { useEffect, useRef } from "react";

export default function MoodBackground({ className = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", (e.clientX - r.left) + "px");
        el.style.setProperty("--sy", (e.clientY - r.top) + "px");
      });
    };
    window.addEventListener("pointermove", move);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={"pointer-events-none absolute inset-0 overflow-hidden noise " + className}
      style={{
        background: "radial-gradient(600px circle at var(--sx, 50%) var(--sy, 30%), #f9731622, transparent 60%)",
      }}
    />
  );
}