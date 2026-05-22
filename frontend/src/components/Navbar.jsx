import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  return (
    <nav className="glass-nav fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-3">
      <Link to="/" className="flex items-center gap-2 type-shift">
        <Icon icon="lucide:camera" className="w-6 h-6" style={{ color: "var(--brand)" }} />
        <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-1)" }}>SiteSnap</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--text-2)" }}
          >
            {link.label}
          </a>
        ))}
      </div>
      <Link to="/login" className="btn-secondary text-sm px-4 py-2">
        Sign in
      </Link>
    </nav>
  );
}