// Reveal.jsx — scroll-driven section reveal with clip-path mask.

//
// USAGE
//   <Reveal as="section" className="py-24">
//     <h2>Section heading</h2>
//   </Reveal>
//
// Native path: scroll-timeline + animation-timeline: view(). No JS observer.
// Fallback: IntersectionObserver adds .is-revealed.

import * as React from "react";
import { useEffect, useRef } from "react";

const supportsViewTimeline =
  typeof window !== "undefined" &&
  typeof CSS !== "undefined" &&
  CSS.supports?.("(animation-timeline: view())");

export default function Reveal({ as: Tag = "div", children, className = "", style, once = true, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    if (supportsViewTimeline) return; // CSS handles it
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          if (once) obs.disconnect();
        } else if (!once) {
          el.classList.remove("is-revealed");
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`.trim()}
      style={style}
      {...rest}
    >
      {children}
    </Tag>
  );
}