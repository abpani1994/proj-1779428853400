import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { fadeUp, staggerContainer, splitChars, cardHover } from "../lib/motion-presets.js";

import Navbar from "../components/Navbar.jsx";
import MoodBackground from "../components/MoodBackground.jsx";
import Hero3D from "../components/Hero3D.jsx";
import ShimmerButton from "../components/effects/ShimmerButton.jsx";
import Marquee from "../components/effects/Marquee.jsx";
import BorderBeam from "../components/effects/BorderBeam.jsx";
import NumberTicker from "../components/effects/NumberTicker.jsx";
import MarqueeBand from "../components/MarqueeBand.jsx";
import Reveal from "../components/Reveal.jsx";
import StatCounter from "../components/StatCounter.jsx";
import MagneticCard from "../components/MagneticCard.jsx";
import SpotlightCard from "../components/SpotlightCard.jsx";
import Eyebrow from "../components/Eyebrow.jsx";
import DisplayHeading from "../components/DisplayHeading.jsx";
import SplitText from "../components/SplitText.jsx";
import PullQuote from "../components/PullQuote.jsx";
import PricingTier from "../components/PricingTier.jsx";
import TestimonialCard from "../components/TestimonialCard.jsx";
import FAQRow from "../components/FAQRow.jsx";
import ProgressFlowSection from "../components/ProgressFlowSection.jsx";

const preHeroQuotes = [
  "Used by 2,400+ contractors",
  "Replaces 5 tools",
  "30 seconds to a progress report",
  "No training needed",
  "Enterprise visibility. Crew simplicity.",
  "AI that reads your jobsite",
  "Clients love the portal",
  "Phone photos. That's it.",
];

const trustedLogos = [
  { icon: "logos:google", name: "Google" },
  { icon: "logos:stripe", name: "Stripe" },
  { icon: "logos:slack-icon", name: "Slack" },
  { icon: "logos:figma", name: "Figma" },
  { icon: "logos:notion-icon", name: "Notion" },
  { icon: "logos:linear-icon", name: "Linear" },
];

const features = [
  {
    icon: "lucide:layers",
    title: "Smart photo timeline",
    desc: "Every photo auto-sorted by project, date, and location. Visual history at a glance.",
    span: "col-span-6 md:col-span-3 row-span-2",
    variant: "tile-brand",
  },
  {
    icon: "lucide:bot",
    title: "AI progress detection",
    desc: "Claude vision analyzes each photo. Materials, completion, safety flags — detected automatically.",
    span: "col-span-6 md:col-span-3 row-span-1",
    variant: "tile-feature",
  },
  {
    icon: "lucide:file-text",
    title: "Crew daily reports",
    desc: "One-tap daily logs. AI generates the summary your clients expect.",
    span: "col-span-6 md:col-span-3 row-span-1",
    variant: "tile-pattern",
  },
  {
    icon: "lucide:bar-chart-3",
    title: "Progress tracking",
    desc: "Completion percentages updated with every photo. Trends over time.",
    span: "col-span-6 md:col-span-2 row-span-1",
    variant: "tile-dark",
  },
  {
    icon: "lucide:share-2",
    title: "Client share portal",
    desc: "One link. Clients see progress photos, reports, and timelines. No login needed.",
    span: "col-span-6 md:col-span-2 row-span-1",
    variant: "tile-accent",
  },
  {
    icon: "lucide:shield",
    title: "Compliance docs",
    desc: "Safety flags and compliance documentation generated from your photos.",
    span: "col-span-6 md:col-span-2 row-span-1",
    variant: "tile-feature",
  },
  {
    icon: "lucide:bell",
    title: "Schedule alerts",
    desc: "AI detects when progress slows. Get notified before delays become problems.",
    span: "col-span-6 md:col-span-3 row-span-2",
    variant: "tile-feature",
  },
  {
    icon: "lucide:smartphone",
    title: "No special hardware",
    desc: "Works with any phone camera. No drones, no sensors, no training.",
    span: "col-span-6 md:col-span-3 row-span-1",
    variant: "tile-dark",
  },
];

const stats = [
  { value: 2400, suffix: "+", label: "Contractors" },
  { value: 850000, suffix: "", label: "Photos analyzed" },
  { value: 30, suffix: "s", label: "Average report time" },
  { value: 98, suffix: "%", label: "Accuracy rate" },
];

const testimonials = [
  {
    quote: "Replaced our entire reporting workflow. Clients get updates without me lifting a finger.",
    name: "Marcus Rivera",
    role: "General Contractor",
    avatar: "https://api.dicebear.com/7.x/beam/svg?seed=Marcus Rivera",
  },
  {
    quote: "My crew snaps photos. SiteSnap does the rest. Three hours saved every week.",
    name: "Sarah Chen",
    role: "Project Manager",
    avatar: "https://api.dicebear.com/7.x/beam/svg?seed=Sarah Chen",
  },
  {
    quote: "The compliance flagging caught a safety issue before the inspector did. Worth every cent.",
    name: "David Okonkwo",
    role: "Site Supervisor",
    avatar: "https://api.dicebear.com/7.x/beam/svg?seed=David Okonkwo",
  },
];

const faqs = [
  {
    q: "Do my crew members need to download an app?",
    a: "No. SiteSnap works through any phone's camera and browser. Take a photo, upload it. Done. No training, no app store, no friction.",
  },
  {
    q: "How accurate is the AI progress detection?",
    a: "Our AI achieves 98% accuracy on standard construction elements like framing, roofing, electrical, and concrete work. It improves with each project as it learns your specific patterns.",
  },
  {
    q: "Can clients see my project without creating an account?",
    a: "Yes. Generate a share link and send it. Clients see photos, reports, and timelines. No login required. Links can be set to expire.",
  },
  {
    q: "What if I lose internet on the jobsite?",
    a: "Photos sync when you're back online. Take them anytime. The timeline stays accurate based on when the photo was taken, not when it was uploaded.",
  },
  {
    q: "Is my project data secure?",
    a: "All data is encrypted at rest and in transit. Share links are tokenized and can be revoked instantly. We never share your data with third parties.",
  },
];

function useMagnetic(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handlePointerMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    };
    const handlePointerLeave = () => {
      el.style.transform = "translate(0px, 0px)";
      el.style.transition = "transform 0.4s ease-out";
    };
    const handlePointerEnter = () => {
      el.style.transition = "none";
    };
    el.addEventListener("pointermove", handlePointerMove);
    el.addEventListener("pointerleave", handlePointerLeave);
    el.addEventListener("pointerenter", handlePointerEnter);
    return () => {
      el.removeEventListener("pointermove", handlePointerMove);
      el.removeEventListener("pointerleave", handlePointerLeave);
      el.removeEventListener("pointerenter", handlePointerEnter);
    };
  }, [ref]);
}

function useScrollReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.15 }
    );
    const children = el.querySelectorAll(".scroll-reveal-item");
    children.forEach((child) => {
      child.style.opacity = "0";
      child.style.transform = "translateY(32px)";
      child.style.transition = "opacity 0.7s ease-out, transform 0.7s ease-out";
      observer.observe(child);
    });
    return () => observer.disconnect();
  }, []);
  return ref;
}

function CountUpNumber({ value, suffix, label }) {
  const numRef = useRef(null);
  useEffect(() => {
    const el = numRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let start = 0;
            const end = value;
            const duration = 2000;
            const stepTime = 16;
            const steps = duration / stepTime;
            const increment = end / steps;
            const timer = setInterval(() => {
              start += increment;
              if (start >= end) {
                start = end;
                clearInterval(timer);
              }
              el.textContent = Math.floor(start).toLocaleString() + suffix;
            }, stepTime);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, suffix]);
  return (
    <div className="card text-center p-8">
      <span
        ref={numRef}
        className="count-up text-gradient text-4xl md:text-5xl font-bold"
        style={{ fontVariantNumeric: "tabular-nums" }}
        data-counter={value}
      >
        0{suffix}
      </span>
      <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>{label}</p>
    </div>
  );
}

export default function LandingPage() {
  const heroBtnRef = useRef(null);
  useMagnetic(heroBtnRef);
  const featuresRef = useScrollReveal();
  const statsRef = useScrollReveal();
  const testimonialsRef = useScrollReveal();
  const faqRef = useScrollReveal();
  const wildcardRef = useScrollReveal();
  const ctaRef = useScrollReveal();

  return (
    <div className="min-h-screen" style={{ background: "#f5f5f7" }}>
      <Navbar />

      {/* Pre-hero marquee */}
      <div className="pt-16 pb-0">
        <MarqueeBand
          variant="spacious"
          items={preHeroQuotes}
          pauseOnHover
          className="text-sm font-medium opacity-50 py-4"
          speed={60}
        />
      </div>

      {/* Section 1: Hero */}
      <section className="aurora-bg noise relative overflow-hidden min-h-[88vh] flex items-center justify-center">
        <MoodBackground />
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-90">
          <Hero3D />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp}>
              <Eyebrow accent icon="◆">Built for small contractors</Eyebrow>
            </motion.div>
            <motion.h1
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-gradient mt-6 text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.05]"
              style={{ color: "var(--text-1)" }}
            >
              <SplitText by="word" variants={splitChars}>
                Every photo tells your project's story
              </SplitText>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="mt-6 text-xl max-w-2xl mx-auto"
              style={{ color: "var(--text-2)" }}
            >
              Turn jobsite photos into progress reports, schedule alerts, and compliance docs. No special hardware. No training.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <span ref={heroBtnRef} className="inline-block">
                  <ShimmerButton className="btn-primary magnetic pulse-glow text-lg px-8 py-4">
                    Start free trial
                  </ShimmerButton>
                </span>
              </Link>
              <Link to="/login">
                <button className="btn-secondary text-lg px-8 py-4">
                  Sign in
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Trusted Logos */}
      <section className="aurora-bg noise relative overflow-hidden py-16">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Reveal>
            <p className="pill inline-block mb-8 text-sm" style={{ color: "var(--text-3)" }}>Trusted by teams at</p>
          </Reveal>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {trustedLogos.map((logo) => (
              <Reveal key={logo.name}>
                <Icon icon={logo.icon} width={36} height={36} className="opacity-40 hover:opacity-80 transition-opacity" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Bento Features Grid */}
      <section className="aurora-bg noise relative overflow-hidden py-24" ref={featuresRef}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <Eyebrow accent>Features</Eyebrow>
              <h2 className="text-gradient mt-4 text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-1)" }}>
                Everything your jobsite needs
              </h2>
              <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "var(--text-2)" }}>
                An asymmetric grid of capabilities — each one a mini product demo.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-6 gap-4 auto-rows-[180px]">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className={`card scroll-reveal-item ${f.span} p-6 flex flex-col justify-between`}
                variants={cardHover}
                whileHover="hover"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div>
                  <div className="pill inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4" style={{ background: "var(--accent-a10, rgba(99,102,241,0.1))" }}>
                    <Icon icon={f.icon} width={22} height={22} style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="text-lg font-semibold" style={{ color: "var(--text-1)" }}>{f.title}</h3>
                </div>
                <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>{f.desc}</p>
                <BorderBeam />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Stats */}
      <section className="aurora-bg noise relative overflow-hidden py-24" ref={statsRef}>
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <Eyebrow accent>By the numbers</Eyebrow>
              <h2 className="text-gradient mt-4 text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-1)" }}>
                Trusted at scale
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={s.label} className="scroll-reveal-item" style={{ transitionDelay: `${i * 100}ms` }}>
                <CountUpNumber value={s.value} suffix={s.suffix} label={s.label} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Wildcard — "The SiteSnap Workflow" interactive showcase */}
      <section className="aurora-bg noise relative overflow-hidden py-24" ref={wildcardRef}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <Eyebrow accent icon="✦">The Workflow</Eyebrow>
              <h2 className="text-gradient mt-4 text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-1)" }}>
                From photo to report in 30 seconds
              </h2>
              <p className="mt-4 text-lg max-w-2xl mx-auto" style={{ color: "var(--text-2)" }}>
                Three steps. Zero friction. Here's how SiteSnap transforms your daily routine.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "lucide:camera",
                title: "Snap a photo",
                desc: "Your crew takes photos on any phone. No app needed — just the browser camera.",
                img: "https://picsum.photos/seed/sitesnap-step1/600/400",
              },
              {
                step: "02",
                icon: "lucide:cpu",
                title: "AI analyzes instantly",
                desc: "Claude vision identifies materials, progress percentage, and safety concerns in real time.",
                img: "https://picsum.photos/seed/sitesnap-step2/600/400",
              },
              {
                step: "03",
                icon: "lucide:send",
                title: "Report delivered",
                desc: "A polished progress report is auto-generated and shared with your client portal.",
                img: "https://picsum.photos/seed/sitesnap-step3/600/400",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                className="card scroll-reveal-item p-0 overflow-hidden flex flex-col"
                variants={cardHover}
                whileHover="hover"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="pill text-xs font-bold px-3 py-1">{item.step}</span>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon icon={item.icon} width={24} height={24} style={{ color: "var(--accent)" }} />
                    <h3 className="text-lg font-semibold" style={{ color: "var(--text-1)" }}>{item.title}</h3>
                  </div>
                  <p className="text-sm flex-1" style={{ color: "var(--text-2)" }}>{item.desc}</p>
                </div>
                <BorderBeam />
              </motion.div>
            ))}
          </div>
          <Reveal>
            <div className="mt-12 text-center">
              <Link to="/register">
                <button className="btn-primary magnetic pulse-glow text-lg px-8 py-4">
                  Try it yourself — free
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Section 6: Testimonials */}
      <section className="aurora-bg noise relative overflow-hidden py-24" ref={testimonialsRef}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <Eyebrow accent>What they say</Eyebrow>
              <h2 className="text-gradient mt-4 text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-1)" }}>
                Loved by builders
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                className="card scroll-reveal-item p-8 flex flex-col"
                variants={cardHover}
                whileHover="hover"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <p className="text-base italic flex-1" style={{ color: "var(--text-2)" }}>"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-3)" }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7: FAQ */}
      <section className="aurora-bg noise relative overflow-hidden py-24" ref={faqRef}>
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <Eyebrow accent>FAQ</Eyebrow>
              <h2 className="text-gradient mt-4 text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--text-1)" }}>
                Common questions
              </h2>
            </div>
          </Reveal>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="card scroll-reveal-item p-0" style={{ transitionDelay: `${i * 80}ms` }}>
                <FAQRow question={faq.q} answer={faq.a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="aurora-bg noise relative overflow-hidden py-32" ref={ctaRef}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Reveal>
            <h2 className="text-gradient text-4xl md:text-6xl font-bold tracking-tight" style={{ color: "var(--text-1)" }}>
              Start documenting smarter
            </h2>
            <p className="mt-6 text-xl" style={{ color: "var(--text-2)" }}>
              Free for your first project. No credit card required.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <button className="btn-primary magnetic pulse-glow text-lg px-10 py-4">
                  Get started free
                </button>
              </Link>
              <Link to="/login">
                <button className="btn-secondary text-lg px-8 py-4">
                  Sign in
                </button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}