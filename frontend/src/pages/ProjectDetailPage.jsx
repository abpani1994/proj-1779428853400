import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  getProject,
  addPhoto,
  deletePhoto,
  analyzePhoto,
  createReport,
  generateReportSummary,
  createShareLink,
} from "../services/api.js";
import Skeleton from "../components/Skeleton.jsx";
import Hero3D from "../components/Hero3D";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("photos");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [addingPhoto, setAddingPhoto] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [reportForm, setReportForm] = useState({ workPerformed: "", weather: "", crewCount: "", issues: "" });
  const [creatingReport, setCreatingReport] = useState(false);
  const [generatingId, setGeneratingId] = useState(null);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("sitesnap_token");
    if (!token) { navigate("/login"); return; }
    loadProject();
  }, [id, navigate]);

  async function loadProject() {
    try {
      const data = await getProject(id);
      setProject(data);
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddPhoto(e) {
    e.preventDefault();
    if (!photoUrl) return;
    setAddingPhoto(true);
    try {
      await addPhoto(id, { url: photoUrl, caption: photoCaption });
      setPhotoUrl("");
      setPhotoCaption("");
      await loadProject();
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingPhoto(false);
    }
  }

  async function handleAnalyze(photoId) {
    setAnalyzingId(photoId);
    try {
      await analyzePhoto(photoId);
      await loadProject();
    } catch (err) {
      alert(err.message);
    } finally {
      setAnalyzingId(null);
    }
  }

  async function handleDeletePhoto(photoId) {
    if (!confirm("Delete this photo?")) return;
    try {
      await deletePhoto(photoId);
      await loadProject();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleCreateReport(e) {
    e.preventDefault();
    setCreatingReport(true);
    try {
      await createReport(id, {
        ...reportForm,
        crewCount: reportForm.crewCount ? parseInt(reportForm.crewCount, 10) : null,
      });
      setReportForm({ workPerformed: "", weather: "", crewCount: "", issues: "" });
      setShowReport(false);
      await loadProject();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreatingReport(false);
    }
  }

  async function handleGenerateSummary(reportId) {
    setGeneratingId(reportId);
    try {
      await generateReportSummary(reportId);
      await loadProject();
    } catch (err) {
      alert(err.message);
    } finally {
      setGeneratingId(null);
    }
  }

  async function handleShare() {
    try {
      const link = await createShareLink(id, 30);
      const url = `${window.location.origin}/shared/${link.token}`;
      setShareUrl(url);
      navigator.clipboard?.writeText(url);
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <section className="aurora-bg noise relative overflow-hidden min-h-screen px-6 py-20">
        <div className="max-w-5xl mx-auto space-y-4">
          <Skeleton w="40%" h="2rem" className="shimmer" />
          <Skeleton variant="card" className="h-64 shimmer" />
        </div>
      </section>
    );
  }

  if (!project) return null;

  return (
    <section className="aurora-bg noise relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-90"><Hero3D /></div>

      <nav className="glass-nav sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-3">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium" style={{ color: "var(--text-2)" }}>
          <Icon icon="lucide:arrow-left" className="w-4 h-4" />
          Back to projects
        </Link>
        <button onClick={handleShare} className="btn-secondary text-sm flex items-center gap-2 px-3 py-1.5">
          <Icon icon="lucide:share-2" className="w-4 h-4" />
          Share
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-gradient text-3xl font-bold">{project.name}</h1>
          {project.address && (
            <p className="text-sm mt-1 flex items-center gap-1" style={{ color: "var(--text-2)" }}>
              <Icon icon="lucide:map-pin" className="w-4 h-4" />
              {project.address}
            </p>
          )}
          {project.description && (
            <p className="text-sm mt-2" style={{ color: "var(--text-2)" }}>{project.description}</p>
          )}
        </div>

        {shareUrl && (
          <div className="card rounded-xl p-4 mb-6 flex items-center gap-3">
            <Icon icon="lucide:link" className="w-5 h-5" style={{ color: "var(--brand)" }} />
            <input className="input flex-1 text-sm" readOnly value={shareUrl} />
            <span className="text-xs pill">Copied</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: "var(--surface-2)" }}>
          {["photos", "reports"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                tab === t ? "card shadow-sm" : ""
              }`}
              style={{ color: tab === t ? "var(--text-1)" : "var(--text-2)" }}
            >
              {t === "photos" ? "Photo timeline" : "Daily reports"}
            </button>
          ))}
        </div>

        {tab === "photos" && (
          <div>
            <form onSubmit={handleAddPhoto} className="card rounded-xl p-4 mb-6 flex flex-col sm:flex-row gap-3">
              <input
                className="input flex-1 text-sm"
                placeholder="Photo URL (paste a link)"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                required
              />
              <input
                className="input flex-1 text-sm"
                placeholder="Caption (optional)"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
              />
              <button type="submit" className="btn-primary text-sm whitespace-nowrap" disabled={addingPhoto}>
                {addingPhoto ? "Adding..." : "Add photo"}
              </button>
            </form>

            {project.photos?.length === 0 ? (
              <div className="card rounded-xl p-12 text-center">
                <Icon icon="lucide:image" className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--text-2)" }} />
                <p className="font-bold" style={{ color: "var(--text-1)" }}>No photos yet</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Add your first jobsite photo above.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {project.photos?.map((photo) => (
                  <div key={photo.id} className="card rounded-xl overflow-hidden group">
                    <img
                      src={photo.url}
                      alt={photo.caption || "Jobsite photo"}
                      className="w-full aspect-video object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      {photo.caption && (
                        <p className="text-sm font-medium mb-2" style={{ color: "var(--text-1)" }}>{photo.caption}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAnalyze(photo.id)}
                          disabled={analyzingId === photo.id}
                          className="btn-secondary text-xs flex items-center gap-1 px-2 py-1"
                        >
                          <Icon icon="lucide:sparkles" className="w-3 h-3" />
                          {analyzingId === photo.id ? "Analyzing..." : "Analyze"}
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="btn-secondary text-xs flex items-center gap-1 px-2 py-1"
                        >
                          <Icon icon="lucide:trash-2" className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                      {photo.analysis && (
                        <div className="card mt-3 p-3 rounded-lg">
                          <p className="text-xs font-medium mb-1" style={{ color: "var(--text-1)" }}>AI Analysis</p>
                          <p className="text-xs" style={{ color: "var(--text-2)" }}>{photo.analysis}</p>
                          {photo.tags && photo.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {photo.tags.map((tag, i) => (
                                <span key={i} className="pill text-xs">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "reports" && (
          <div>
            {!showReport ? (
              <button onClick={() => setShowReport(true)} className="btn-primary magnetic pulse-glow text-sm flex items-center gap-2 mb-6">
                <Icon icon="lucide:plus" className="w-4 h-4" />
                New daily report
              </button>
            ) : (
              <form onSubmit={handleCreateReport} className="card rounded-xl p-6 mb-6 space-y-4">
                <h3 className="font-bold text-lg" style={{ color: "var(--text-1)" }}>New Daily Report</h3>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-2)" }}>Work performed</label>
                  <textarea
                    className="input w-full text-sm"
                    rows={3}
                    value={reportForm.workPerformed}
                    onChange={(e) => setReportForm({ ...reportForm, workPerformed: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-2)" }}>Weather</label>
                    <input
                      className="input w-full text-sm"
                      value={reportForm.weather}
                      onChange={(e) => setReportForm({ ...reportForm, weather: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-2)" }}>Crew count</label>
                    <input
                      className="input w-full text-sm"
                      type="number"
                      value={reportForm.crewCount}
                      onChange={(e) => setReportForm({ ...reportForm, crewCount: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-2)" }}>Issues / blockers</label>
                  <textarea
                    className="input w-full text-sm"
                    rows={2}
                    value={reportForm.issues}
                    onChange={(e) => setReportForm({ ...reportForm, issues: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="btn-primary text-sm" disabled={creatingReport}>
                    {creatingReport ? "Saving..." : "Save report"}
                  </button>
                  <button type="button" onClick={() => setShowReport(false)} className="btn-secondary text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {project.reports?.length === 0 ? (
              <div className="card rounded-xl p-12 text-center">
                <Icon icon="lucide:file-text" className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--text-2)" }} />
                <p className="font-bold" style={{ color: "var(--text-1)" }}>No reports yet</p>
                <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>Create your first daily report.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {project.reports?.map((report) => (
                  <div key={report.id} className="card rounded-xl p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold" style={{ color: "var(--text-1)" }}>
                          {new Date(report.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          {report.weather && (
                            <span className="pill text-xs flex items-center gap-1">
                              <Icon icon="lucide:cloud" className="w-3 h-3" />
                              {report.weather}
                            </span>
                          )}
                          {report.crewCount && (
                            <span className="pill text-xs flex items-center gap-1">
                              <Icon icon="lucide:users" className="w-3 h-3" />
                              {report.crewCount} crew
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleGenerateSummary(report.id)}
                        disabled={generatingId === report.id}
                        className="btn-secondary text-xs flex items-center gap-1"
                      >
                        <Icon icon="lucide:sparkles" className="w-3 h-3" />
                        {generatingId === report.id ? "Generating..." : "AI Summary"}
                      </button>
                    </div>
                    <p className="text-sm mb-2" style={{ color: "var(--text-2)" }}>{report.workPerformed}</p>
                    {report.issues && (
                      <div className="card rounded-lg p-3 mt-2">
                        <p className="text-xs font-medium mb-1" style={{ color: "var(--text-1)" }}>Issues</p>
                        <p className="text-xs" style={{ color: "var(--text-2)" }}>{report.issues}</p>
                      </div>
                    )}
                    {report.summary && (
                      <div className="card rounded-lg p-3 mt-2">
                        <p className="text-xs font-medium mb-1" style={{ color: "var(--text-1)" }}>AI Summary</p>
                        <p className="text-xs" style={{ color: "var(--text-2)" }}>{report.summary}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}