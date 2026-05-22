import React, { useRef } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import AnimatedBeam from "./effects/AnimatedBeam.jsx";
import { fadeUp, staggerContainer } from "../lib/motion-presets.js";
import Reveal from "./Reveal.jsx";
import Eyebrow from "./Eyebrow.jsx";
import DisplayHeading from "./DisplayHeading.jsx";

const steps = [
  { icon: "lucide:camera", label: "Snap a photo", desc: "Your crew takes a photo on any phone. No app needed." },
  { icon: "lucide:upload-cloud", label: "Upload to SiteSnap", desc: "Photos sync instantly to your project timeline." },
  { icon: "lucide:bot", label: "AI analyzes", desc: "Claude vision detects progress, materials, and safety." },
  { icon: "lucide:file-text", label: "Report generated", desc: "Structured reports ready for your clients in seconds." },
];

function FlowNode({ icon, label, desc, nodeRef, index }) {
  return (
    <motion.div
      ref={nodeRef}
      variants={fadeUp}
      className="card relative flex flex-col items-center text-center z-10 p-6"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: index === 2
            ? "linear-gradient(135deg, var(--brand), var(--accent))"
            : "var(--surface-2)",
        }}
      >
        <Icon icon={icon} className="w-7 h-7" style={{ color: index === 2 ? "#fff" : "var(--text-1)" }} />
      </div>
      <h4 className="text-lg font-bold mb-1" style={{ color: "var(--text-1)" }}>{label}</h4>
      <p className="text-sm max-w-[180px]" style={{ color: "var(--text-2)" }}>{desc}</p>
      <span className="pill mt-3">Step {index + 1}</span>
    </motion.div>
  );
}

export default function ProgressFlowSection() {
  const containerRef = useRef(null);
  const nodeRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  return (
    <Reveal as="section" className="aurora-bg noise relative overflow-hidden py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15%" }}
          className="text-center mb-16"
        >
          <motion.div variants={fadeUp}>
            <Eyebrow accent>How it works</Eyebrow>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-4">
            <DisplayHeading level={2} accent="last">
              Photo to report in seconds
            </DisplayHeading>
          </motion.div>
        </motion.div>

        <div ref={containerRef} className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <FlowNode
                key={i}
                icon={step.icon}
                label={step.label}
                desc={step.desc}
                nodeRef={nodeRefs[i]}
                index={i}
              />
            ))}
          </div>

          <div className="hidden md:block">
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={nodeRefs[0]}
              toRef={nodeRefs[1]}
              gradientStartColor="var(--brand)"
              gradientStopColor="var(--accent)"
              duration={3}
              pathWidth={2}
              pathOpacity={0.15}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={nodeRefs[1]}
              toRef={nodeRefs[2]}
              gradientStartColor="var(--brand)"
              gradientStopColor="var(--accent)"
              duration={3}
              delay={0.5}
              pathWidth={2}
              pathOpacity={0.15}
            />
            <AnimatedBeam
              containerRef={containerRef}
              fromRef={nodeRefs[2]}
              toRef={nodeRefs[3]}
              gradientStartColor="var(--accent)"
              gradientStopColor="var(--brand)"
              duration={3}
              delay={1}
              pathWidth={2}
              pathOpacity={0.15}
            />
          </div>
        </div>
      </div>
    </Reveal>
  );
}