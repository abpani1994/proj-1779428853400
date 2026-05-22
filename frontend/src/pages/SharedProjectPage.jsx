import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getSharedProject } from "../services/api.js";
import Skeleton from "../components/Skeleton.jsx";
import Hero3D from "../components/Hero3D";

export default function SharedProjectPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const result = await getSharedProject(token);
        setData(result.project);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <section className="aurora-bg noise relative overflow-hidden min-h-screen px-6 py-20">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton w="50%" h="2rem" className="shimmer" />
          <Skeleton variant="card" className="h-64 shimmer" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="aurora-bg noise relative overflow-hidden min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <Icon icon="lucide:link-2-off" className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--text-2)" }} />
          <h1 className="text-gradient text-2xl font-bold mb-2">Link unavailable</h1>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>{error}</p>
          <Link to="/" className="btn-primary magnetic pulse-glow mt-6 inline-block">Go to SiteSnap</Link>
        </div>
      </section>
    );
  }

  if (!data) return null;

  return (
    <section className="aurora-bg noise relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-90"><Hero3D /></div>

      <nav className="glass-nav sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-3">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:camera" className="w-6 h-6" style={{ color: "var(--brand)" }} />
          <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-1)" }}>SiteSnap</span>
        </div>
        <span className="pill text-xs">Shared view</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-gradient text-3xl font-bold mb-2">{data.name}</h1>
        {data.address && (
          <p className="text-sm flex items-center gap-1 mb-1" style={{ color: "var(--text-2)" }}>
            <Icon icon="lucide:map-pin" className="w-4 h-4" />
            {data.address}
          </p>
        )}
        {data.description && (
          <p className="text-sm mb-8" style={{ color: "var(--text-2)" }}>{data.description}</p>
        )}

        {data.photos?.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-1)" }}>Photo timeline</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {data.photos.map((photo) => (
                <div key={photo.id} className="card rounded-xl overflow-hidden">
                  <img
                    src={photo.url}
                    alt={photo.caption || "Jobsite photo"}
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                  />
                  <div className="p-4">
                    {photo.caption && <p className="text-sm font-medium mb-1" style={{ color: "var(--text-1)" }}>{photo.caption}</p>}
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>
                      {new Date(photo.takenAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    {photo.analysis?.summary && (
                      <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>
                        {photo.analysis.progressPercent != null && (
                          <p className="count-up text-gradient font-bold mb-1 tabular-nums">{photo.analysis.progressPercent}% complete</p>
                        )}
                        <p>{photo.analysis.summary}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.dailyReports?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-1)" }}>Daily reports</h2>
            <div className="space-y-4">
              {data.dailyReports.map((report) => (
                <div key={report.id} className="card rounded-xl p-6">
                  <h4 className="font-bold mb-2" style={{ color: "var(--text-1)" }}>
                    {new Date(report.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </h4>
                  <p className="text-sm" style={{ color: "var(--text-1)" }}>{report.workPerformed}</p>
                  {report.aiSummary && (
                    <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>
                      <span className="pill text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand)" }}>AI Summary</span>
                      <p className="mt-1">{report.aiSummary}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  );
}