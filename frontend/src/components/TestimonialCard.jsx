// TestimonialCard.jsx — editorial quote card with 3 variants.

//
// Variants:
//   • "card"      (default) — full bordered card with avatar + role row
//   • "editorial" — large serif-italic quote, attribution beneath, no card
//                   border, magazine-style. Bigger visual statement.
//   • "inline"    — minimal: just quote + small attribution row, hairline-top
//                   only (no card box). Use in dense grids.
//
// USAGE
//   <TestimonialCard quote="..." name="Sarah" role="Designer at Linear" />
//   <TestimonialCard variant="editorial" quote="..." name="..." role="..." />
//   <TestimonialCard variant="inline" quote="..." name="..." />

import * as React from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

function resolveAvatar(avatar, name) {
  if (avatar && !avatar.includes("placeholder.com")) return avatar;
  const seed = encodeURIComponent(name || "User");
  return `https://api.dicebear.com/7.x/beam/svg?seed=${seed}`;
}

export default function TestimonialCard({
  variant = "card",
  quote,
  name,
  role,
  avatar,
  className = "",
  ...rest
}) {
  if (variant === "editorial") {
    return (
      <figure className={cn("testimonial-card testimonial-card--editorial relative py-6 md:py-10 px-4", className)} {...rest}>
        <span className="block text-6xl md:text-7xl font-serif leading-none text-[color:var(--brand)]/30 mb-2" aria-hidden>"</span>
        <blockquote
          className="font-serif italic text-2xl md:text-3xl lg:text-4xl leading-snug tracking-[-0.01em] text-[color:var(--text-1)]"
          style={{ textWrap: "balance", fontOpticalSizing: "auto" }}
        >
          {quote}
        </blockquote>
        <figcaption className="mt-6 flex items-center gap-3 uppercase tracking-[0.22em] text-[11px] text-[color:var(--text-2)]">
          <img
            src={resolveAvatar(avatar, name)}
            alt=""
            width={32}
            height={32}
            loading="lazy"
            className="w-8 h-8 rounded-full border border-[color:var(--hairline)]"
          />
          <span className="font-semibold text-[color:var(--text-1)]">{name}</span>
          {role && <><span aria-hidden>·</span><span>{role}</span></>}
        </figcaption>
      </figure>
    );
  }

  if (variant === "inline") {
    return (
      <figure className={cn("testimonial-card testimonial-card--inline flex flex-col gap-3 pt-5 border-t border-[color:var(--hairline)]", className)} {...rest}>
        <blockquote
          className="font-serif italic text-base md:text-lg leading-snug text-[color:var(--text-1)]"
          style={{ textWrap: "pretty" }}
        >
          "{quote}"
        </blockquote>
        <figcaption className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-2)] mono">
          <img
            src={resolveAvatar(avatar, name)}
            alt=""
            width={24}
            height={24}
            loading="lazy"
            className="w-6 h-6 rounded-full border border-[color:var(--hairline)]"
          />
          <span className="font-semibold text-[color:var(--text-1)]">{name}</span>
          {role && <span aria-hidden>· {role}</span>}
        </figcaption>
      </figure>
    );
  }

  // default: "card"
  const resolvedAvatar = resolveAvatar(avatar, name);

  return (
    <figure
      className={cn(
        "testimonial-card testimonial-card--card card relative flex flex-col gap-5 p-7 rounded-2xl",
        "transition-colors duration-300 hover:border-[color:var(--hairline-strong)]",
        className,
      )}
      {...rest}
    >
      <span className="text-4xl leading-none text-[color:var(--brand)]/40 font-serif" aria-hidden>"</span>
      <blockquote
        className="font-serif italic text-lg md:text-xl leading-snug tracking-[-0.005em] text-[color:var(--text-1)]"
        style={{ textWrap: "pretty", fontOpticalSizing: "auto" }}
      >
        {quote}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 pt-4 border-t border-[color:var(--hairline)]">
        <img
          src={resolvedAvatar}
          alt=""
          width={40}
          height={40}
          loading="lazy"
          className="w-10 h-10 rounded-full border border-[color:var(--hairline)]"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-[color:var(--text-1)]">{name}</span>
          {role && <span className="text-[11px] uppercase tracking-[0.18em] text-[color:var(--text-2)] mono">{role}</span>}
        </div>
      </figcaption>
    </figure>
  );
}