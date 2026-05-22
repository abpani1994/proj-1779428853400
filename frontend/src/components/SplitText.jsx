// SplitText.jsx — split a string into per-word or per-char animatable spans.

//
// USAGE
//   import { motion } from "framer-motion";
//   import SplitText from "./components/SplitText";
//   import { splitChars, staggerContainer } from "./lib/motion-presets";
//
//   <motion.h1 variants={staggerContainer} initial="hidden" whileInView="visible"
//     viewport={{ once: true, margin: "-15%" }}>
//     <SplitText as="span" by="word" variants={splitChars}>
//       Make focus inevitable
//     </SplitText>
//   </motion.h1>
//
// Each word/char is rendered as a <motion.span>. The parent's stagger
// orchestrates them. Whitespace is preserved between words. Punctuation
// is included with its trailing word.

import * as React from "react";
import { motion } from "framer-motion";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function SplitText({
  children,
  as: Tag = "span",
  by = "word",         // "word" | "char"
  className = "",
  spanClassName = "",
  variants,
  style,
  ...rest
}) {
  const text = typeof children === "string" ? children : "";
  if (!text) return null;

  const tokens = by === "char" ? Array.from(text) : text.split(/(\s+)/);

  return (
    <Tag className={cn("split-text inline", className)} style={style} {...rest}>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) return <React.Fragment key={i}>{tok}</React.Fragment>;
        return (
          <motion.span
            key={i}
            variants={variants}
            className={cn("inline-block will-change-transform", spanClassName)}
            style={{ display: "inline-block" }}
          >
            {tok}
          </motion.span>
        );
      })}
    </Tag>
  );
}