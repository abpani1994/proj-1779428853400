// Eyebrow.jsx — mono-caps tag with hairline accent.

//
// USAGE
//   <Eyebrow>FEATURE</Eyebrow>
//   <Eyebrow icon="◆" accent>Now in beta</Eyebrow>
//   <Eyebrow as="span" className="mb-3">Pricing</Eyebrow>

import * as React from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function Eyebrow({
  children,
  as: Tag = "span",
  icon,
  accent = false,
  className = "",
  ...rest
}) {
  return (
    <Tag
      className={cn(
        "pill",
        "inline-flex items-center gap-2 uppercase tracking-[0.22em] text-[10.5px] font-semibold",
        "py-1 px-2.5 rounded-full",
        accent
          ? "text-[color:var(--brand)] bg-[color:var(--brand-soft)] border border-[color:var(--brand)]/15"
          : "text-[color:var(--text-2)] border border-[color:var(--hairline)]",
        "mono",
        className,
      )}
      {...rest}
    >
      {icon && <span className="opacity-80" aria-hidden>{icon}</span>}
      {children}
    </Tag>
  );
}