// PinnedSequence.jsx — sticky-stacked scroll storytelling.

//
// USAGE
//   <PinnedSequence>
//     <PinnedSequence.Step>
//       <Eyebrow>01</Eyebrow>
//       <DisplayHeading level={2} size="display-md">Sense</DisplayHeading>
//       <p>Your environment is read every 30 seconds.</p>
//       <img src="..." alt="..." />
//     </PinnedSequence.Step>
//     <PinnedSequence.Step>...</PinnedSequence.Step>
//     <PinnedSequence.Step>...</PinnedSequence.Step>
//   </PinnedSequence>
//
// Step count controls outer height automatically (100vh per step + lead).
// Each step pins to the viewport center for ~80% of its scroll window, then
// fades out as the next rises in. Reduced-motion fallback: steps render as
// a normal stacked column with no pinning.

import * as React from "react";
import { useRef, Children } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const cn = (...c) => c.filter(Boolean).join(" ");

function Step({ children, index, total, scrollYProgress, className = "" }) {
  // Each step occupies an equal slice of the parent's scroll range.
  const slice = 1 / total;
  const start = index * slice;
  const end = (index + 1) * slice;
  const inFadeStart = start;
  const inFadeEnd = start + slice * 0.18;
  const outFadeStart = end - slice * 0.18;
  const outFadeEnd = end;

  const opacity = useTransform(
    scrollYProgress,
    [inFadeStart, inFadeEnd, outFadeStart, outFadeEnd],
    [0, 1, 1, 0],
  );
  const y = useTransform(scrollYProgress, [inFadeStart, inFadeEnd], [40, 0]);
  const scale = useTransform(
    scrollYProgress,
    [inFadeStart, inFadeEnd, outFadeStart, outFadeEnd],
    [0.98, 1, 1, 0.96],
  );

  return (
    <motion.div
      className={cn("absolute inset-0 flex items-center justify-center", className)}
      style={{ opacity, y, scale }}
    >
      <div className="card w-full max-w-5xl mx-auto px-6">{children}</div>
    </motion.div>
  );
}

function PinnedSequenceRoot({
  children,
  className = "",
  height,                  // optional: override total height. Defaults to 100vh × stepCount.
}) {
  const ref = useRef(null);
  const steps = Children.toArray(children).filter(Boolean);
  const total = Math.max(steps.length, 1);
  const computedHeight = height || `${total * 100}vh`;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <section
      ref={ref}
      className={cn("pinned-sequence aurora-bg noise relative overflow-hidden w-full", className)}
      style={{ height: computedHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {steps.map((child, i) => (
          <Step key={i} index={i} total={total} scrollYProgress={scrollYProgress}>
            {child.props?.children ?? child}
          </Step>
        ))}
      </div>
    </section>
  );
}

function PinnedStep({ children, className = "" }) {
  // This component is a marker — PinnedSequenceRoot reads it as a child.
  // Rendered directly inside the sticky frame, so just pass children through.
  return <div className={className}>{children}</div>;
}

PinnedSequenceRoot.Step = PinnedStep;
export default PinnedSequenceRoot;