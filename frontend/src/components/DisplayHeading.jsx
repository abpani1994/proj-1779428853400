// DisplayHeading.jsx — large display heading with balance + opsz axis.

//
// USAGE
//   <DisplayHeading level={1} accent="last">
//     Make focus inevitable
//   </DisplayHeading>
//
//   <DisplayHeading level={2} size="display-md">
//     <span>The complete</span>
//     <em className="text-gradient">focus stack</em>
//   </DisplayHeading>
//
// accent values:
//   "last"   — last word gets .text-gradient
//   "first"  — first word gets .text-gradient
//   false    — no accent
//   <jsx>    — author splits the content themselves

import * as React from "react";

const cn = (...c) => c.filter(Boolean).join(" ");

const SIZE_MAP = {
  "display-xl": "text-5xl md:text-7xl lg:text-8xl",
  "display-lg": "text-4xl md:text-6xl lg:text-7xl",
  "display-md": "text-3xl md:text-5xl lg:text-6xl",
  "display-sm": "text-2xl md:text-4xl lg:text-5xl",
};

export default function DisplayHeading({
  children,
  level = 1,
  size = level === 1 ? "display-xl" : "display-md",
  accent = false,
  className = "",
  shift = true,
  ...rest
}) {
  const Tag = `h${Math.min(Math.max(level, 1), 6)}`;

  const isH1 = level === 1;

  let content = children;
  if (typeof children === "string" && (accent === "first" || accent === "last")) {
    const words = children.split(" ");
    if (words.length > 1) {
      if (accent === "last") {
        const last = words.pop();
        content = (
          <>
            {words.join(" ")}{" "}
            <span className="text-gradient">{last}</span>
          </>
        );
      } else {
        const first = words.shift();
        content = (
          <>
            <span className="text-gradient">{first}</span>{" "}
            {words.join(" ")}
          </>
        );
      }
    }
  }

  return (
    <Tag
      className={cn(
        SIZE_MAP[size] || SIZE_MAP["display-md"],
        "font-bold tracking-[-0.02em] leading-[1.05]",
        shift && "type-shift",
        isH1 && "text-gradient",
        className,
      )}
      style={{ textWrap: "balance", fontOpticalSizing: "auto" }}
      {...rest}
    >
      {content}
    </Tag>
  );
}