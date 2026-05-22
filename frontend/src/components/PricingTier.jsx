// PricingTier.jsx — pricing card primitive with 3 variants.

//
// Variants:
//   • "default"   — modern SaaS card, soft border, brand-tinted featured tier
//   • "editorial" — magazine-feel: serif headers, hairline-only border, no
//                   shadow, no fill on featured (just thicker hairline + tag)
//   • "tech"      — terminal/dev-tool feel: mono everywhere, dark surface
//                   on featured, gradient CTA, sharp corners
//   • "minimal"   — single-color, no badge, soft hairline, no glow — Aesop-like
//
// USAGE
//   <PricingTier
//     variant="editorial"
//     name="Pro"
//     price="$19" period="/mo"
//     description="Everything in Free, plus..."
//     features={["Unlimited", "Sync", "API"]}
//     cta={{ label: "Start Pro", onClick: () => ... }}
//     featured
//   />
//
// featured = true varies per variant. "default"/"tech": brand-tinted+lift.
// "editorial": thicker hairline + larger price scale. "minimal": just badge.

import * as React from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

const VARIANT_STYLES = {
  default: {
    wrap: "rounded-2xl",
    base: "card",
    featured: "card border-[color:var(--brand)]/30 bg-[color:var(--brand-soft)] shadow-[0_0_40px_-10px_var(--brand-glow)] -translate-y-2",
    name: "text-xs uppercase tracking-[0.22em] font-semibold text-[color:var(--text-2)] mono",
    price: "text-5xl md:text-6xl font-bold tracking-[-0.02em] text-[color:var(--text-1)]",
    featuredCta: "btn-primary magnetic pulse-glow",
    secondaryCta: "btn-secondary",
    badgeBg: "pill bg-[color:var(--brand)] text-[color:var(--surface)]",
    showBadge: true,
  },
  editorial: {
    wrap: "rounded-none",
    base: "card border-l border-[color:var(--hairline)] bg-transparent",
    featured: "card border-l-2 border-[color:var(--brand)] bg-transparent translate-y-0",
    name: "font-serif italic text-base text-[color:var(--text-2)]",
    price: "text-6xl md:text-7xl font-serif tracking-tight text-[color:var(--text-1)]",
    featuredCta: "btn-primary magnetic pulse-glow",
    secondaryCta: "btn-secondary",
    badgeBg: "pill bg-transparent border border-[color:var(--brand)]/30 text-[color:var(--brand)]",
    showBadge: true,
  },
  tech: {
    wrap: "rounded-md",
    base: "card mono",
    featured: "card border-[color:var(--brand)]/40 bg-gradient-to-b from-[color:var(--brand)]/[0.08] to-[color:var(--surface)]/30 shadow-[0_0_60px_-20px_var(--brand-glow)] -translate-y-1 mono",
    name: "text-[11px] uppercase tracking-[0.2em] font-bold text-[color:var(--text-2)] mono",
    price: "text-5xl md:text-6xl font-bold tracking-[-0.04em] text-[color:var(--text-1)] mono",
    featuredCta: "btn-primary magnetic pulse-glow mono",
    secondaryCta: "btn-secondary mono",
    badgeBg: "pill bg-[color:var(--brand)] text-[color:var(--surface)] mono",
    showBadge: true,
  },
  minimal: {
    wrap: "rounded-xl",
    base: "card border border-[color:var(--hairline)] bg-transparent",
    featured: "card border-[color:var(--hairline-strong)] bg-transparent",
    name: "text-xs uppercase tracking-[0.18em] text-[color:var(--text-2)]",
    price: "text-4xl md:text-5xl font-medium tracking-tight text-[color:var(--text-1)]",
    featuredCta: "btn-primary magnetic pulse-glow",
    secondaryCta: "btn-secondary",
    badgeBg: "pill bg-[color:var(--text-1)] text-[color:var(--surface)]",
    showBadge: false,    // minimal hides the badge by default
  },
};

export default function PricingTier({
  variant = "default",
  name,
  price,
  period = "",
  description,
  features = [],
  cta,
  featured = false,
  badge,
  className = "",
  ...rest
}) {
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const showBadge = v.showBadge && (badge || (featured && "Most Popular"));
  const badgeText = badge || (featured ? "Most Popular" : null);

  return (
    <div
      className={cn(
        "pricing-tier relative flex flex-col p-8 transition-all duration-300",
        v.wrap,
        featured ? v.featured : v.base,
        "hover:border-[color:var(--hairline-strong)]",
        className,
      )}
      data-variant={variant}
      {...rest}
    >
      {showBadge && badgeText && (
        <span
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2",
            "uppercase tracking-[0.22em] text-[10px] font-semibold",
            "px-3 py-1 rounded-full",
            v.badgeBg,
          )}
        >
          {badgeText}
        </span>
      )}
      <h3 className={v.name}>{name}</h3>
      <div className="mt-4 flex items-baseline gap-1">
        <span className={v.price} style={{ fontOpticalSizing: "auto" }}>{price}</span>
        {period && <span className="text-base text-[color:var(--text-2)]">{period}</span>}
      </div>
      {description && (
        <p className="mt-3 text-sm text-[color:var(--text-2)] leading-relaxed">{description}</p>
      )}
      <ul className="mt-6 space-y-2 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-[color:var(--text-1)]">
            <span className="text-[color:var(--brand)] mt-0.5" aria-hidden>{variant === "editorial" ? "→" : "✓"}</span>
            <span className="leading-relaxed">{f}</span>
          </li>
        ))}
      </ul>
      {cta && (
        <button
          type="button"
          onClick={cta.onClick}
          className={cn("mt-8 w-full", featured ? v.featuredCta : v.secondaryCta)}
        >
          {cta.label || "Choose plan"}
        </button>
      )}
    </div>
  );
}