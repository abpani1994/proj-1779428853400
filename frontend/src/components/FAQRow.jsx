// FAQRow.jsx — hairline-divided accordion row.

//
// USAGE
//   <div className="divide-y divide-[color:var(--hairline)]">
//     <FAQRow question="..." answer="..." />
//     <FAQRow question="..." answer="..." defaultOpen />
//   </div>
//
// Accessible: button + aria-expanded; collapsing region with aria-hidden.

import * as React from "react";
import { useId, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const cn = (...c) => c.filter(Boolean).join(" ");

export default function FAQRow({
  question,
  answer,
  defaultOpen = false,
  className = "",
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className={cn("faq-row card py-5", className)}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-6 text-left group"
      >
        <span className="text-base md:text-lg font-semibold text-[color:var(--text-1)] leading-snug"
              style={{ textWrap: "balance" }}>
          {question}
        </span>
        <span
          className={cn(
            "shrink-0 w-7 h-7 rounded-full border border-[color:var(--hairline)]",
            "flex items-center justify-center text-[color:var(--text-2)]",
            "transition-all duration-300 group-hover:border-[color:var(--hairline-strong)]",
            open && "rotate-45 border-[color:var(--brand)]/40 text-[color:var(--brand)]",
          )}
          aria-hidden
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] } }}
            className="overflow-hidden"
          >
            <div className="pt-3 pr-12 text-sm md:text-base text-[color:var(--text-2)] leading-relaxed"
                 style={{ textWrap: "pretty" }}>
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}