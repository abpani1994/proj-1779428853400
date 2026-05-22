// HeroVideoDialog — clickable poster image that opens a centered video modal.

//
// Usage:
//   <HeroVideoDialog
//     videoSrc="https://www.youtube.com/embed/..."
//     thumbnailSrc="https://picsum.photos/seed/demo/1280/720"
//     thumbnailAlt="Demo preview"
//   />

import * as React from "react";
import { useState } from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function HeroVideoDialog({
  className,
  animationStyle = "from-center",
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="card group relative block w-full overflow-hidden"
        aria-label="Play video"
      >
        <img src={thumbnailSrc} alt={thumbnailAlt} className="w-full transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/95 shadow-2xl transition-transform group-hover:scale-110 pulse-glow">
            <svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-black"><path d="M8 5v14l11-7z" /></svg>
          </div>
        </div>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="card relative w-full max-w-4xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-secondary absolute -top-12 right-0"
              aria-label="Close video"
            >
              Close ✕
            </button>
            <iframe
              src={videoSrc}
              title="Demo video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full rounded-2xl border border-white/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}