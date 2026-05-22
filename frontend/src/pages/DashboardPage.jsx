import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getProjects, createProject, deleteProject } from "../services/api.js";
import Skeleton from "../components/Skeleton.jsx";
import Hero3D from "../components/Hero3D";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", address: "", description: "" });
  const [creating, setCreating] = useState(false);

  const user = JSON.parse(localStorage.getItem("sitesnap_user") || "{}");

  useEffect(() => {
    const token = localStorage.getItem("sitesnap_token");
    if (!token) { navigate("/login"); return; }
    loadProjects();
  }, [navigate]);

  async function loadProjects() {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      localStorage.removeItem("sitesnap_token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setCreating(true);
    try {
      await createProject(newProject);
      setNewProject({ name: "", address: "", description: "" });
      setShowCreate(false);
      await loadProjects();
    } catch (err) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project and all its data?")) return;
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (err) {
      alert(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("sitesnap_token");
    localStorage.removeItem("sitesnap_user");
    navigate("/");
  }

  return (
    <section className="aurora-bg noise relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-90"><Hero3D /></div>

      <nav className="glass-nav sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-3">
        <Link to="/" className="flex items-center gap-2">
          <Icon icon="lucide:camera" className="w-6 h-6" style={{ color: "var(--brand)" }} />
          <span className="text-lg font-bold tracking-tight" style={{ color: "var(--text-1)" }}>SiteSnap</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium" style={{ color: "var(--text-2)" }}>{user.name}</span>
          <button onClick={handleLogout} className="btn-secondary text-sm px-3 py-1.5">
            Sign out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gradient text-3xl font-bold">Projects</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-2)" }}>
              <span className="count-up text-gradient tabular-nums">{projects.length}</span> active project{projects.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-primary magnetic pulse-glow flex items-center gap-2">
            <Icon icon="lucide:plus" className="w-4 h-4" />
            New project
          </button>
        </div>

        {showCreate && (
          <div className="card rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-1)" }}>Create project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-1)" }}>Project name</label>
                <input
                  type="text"
                  className="input w-full"
                  value={newProject.name}
                  onChange={(e) => setNewProject((p) => ({ ...p, name: e.target.value }))}
                  required
                  placeholder="Main Street Renovation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-1)" }}>Address</label>
                <input
                  type="text"
                  className="input w-full"
                  value={newProject.address}
                  onChange={(e) => setNewProject((p) => ({ ...p, address: e.target.value }))}
                  placeholder="123 Main St, Springfield"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "var(--text-1)" }}>Description</label>
                <textarea
                  className="input w-full"
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Residential remodel, 3-bedroom..."
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary" disabled={creating}>
                  {creating ? "Creating..." : "Create project"}
                </button>
                <button type="button" onClick={() => setShowCreate(false)} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="card" className="shimmer h-40" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="card rounded-2xl p-12 text-center">
            <Icon icon="lucide:folder-open" className="w-12 h-12 mx-auto mb-4" style={{ color: "var(--text-2)" }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-1)" }}>No projects yet</h2>
            <p className="text-sm" style={{ color: "var(--text-2)" }}>Create your first project to start tracking.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="card rounded-2xl p-6 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between">
                  <Link to={`/projects/${project.id}`} className="flex-1">
                    <h3 className="text-lg font-bold group-hover:text-[color:var(--brand)] transition-colors" style={{ color: "var(--text-1)" }}>
                      {project.name}
                    </h3>
                    {project.address && (
                      <p className="text-sm mt-1 flex items-center gap-1" style={{ color: "var(--text-2)" }}>
                        <Icon icon="lucide:map-pin" className="w-3.5 h-3.5" />
                        {project.address}
                      </p>
                    )}
                  </Link>
                  <button onClick={() => handleDelete(project.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                    <Icon icon="lucide:trash-2" className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs" style={{ color: "var(--text-2)" }}>
                  <span className="flex items-center gap-1">
                    <Icon icon="lucide:camera" className="w-3.5 h-3.5" />
                    <span className="count-up text-gradient tabular-nums">{project._count?.photos || 0}</span> photos
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon icon="lucide:file-text" className="w-3.5 h-3.5" />
                    <span className="count-up text-gradient tabular-nums">{project._count?.dailyReports || 0}</span> reports
                  </span>
                  <span className="pill text-[10px]">{project.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}