import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { register } from "../services/api.js";
import Hero3D from "../components/Hero3D";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", company: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await register(form.email, form.password, form.name, form.company);
      localStorage.setItem("sitesnap_token", data.token);
      localStorage.setItem("sitesnap_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="aurora-bg noise relative overflow-hidden min-h-screen flex items-center justify-center px-6">
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-90"><Hero3D /></div>
      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center gap-2 justify-center mb-8">
          <Icon icon="lucide:camera" className="w-7 h-7" style={{ color: "var(--brand)" }} />
          <span className="text-xl font-bold tracking-tight" style={{ color: "var(--text-1)" }}>SiteSnap</span>
        </Link>
        <div className="card rounded-2xl p-8">
          <h1 className="text-2xl font-bold mb-1 text-gradient" style={{ color: "var(--text-1)" }}>Create your account</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>Start tracking in minutes</p>
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-700 border border-red-200">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-1)" }}>Full name</label>
              <input
                type="text"
                className="input w-full"
                value={form.name}
                onChange={update("name")}
                required
                placeholder="Marcus Rivera"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-1)" }}>Email</label>
              <input
                type="email"
                className="input w-full"
                value={form.email}
                onChange={update("email")}
                required
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-1)" }}>Company</label>
              <input
                type="text"
                className="input w-full"
                value={form.company}
                onChange={update("company")}
                placeholder="Rivera Construction"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-1)" }}>Password</label>
              <input
                type="password"
                className="input w-full"
                value={form.password}
                onChange={update("password")}
                required
                minLength={8}
                placeholder="••••••••"
              />
            </div>
            <button type="submit" className="btn-primary magnetic pulse-glow w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm" style={{ color: "var(--text-2)" }}>
            Already have an account? <Link to="/login" className="font-semibold" style={{ color: "var(--brand)" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}