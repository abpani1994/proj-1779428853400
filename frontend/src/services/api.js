const API_BASE = "/api";

function getHeaders() {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("sitesnap_token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(),
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Auth
export function register(email, password, name, company) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name, company }),
  });
}

export function login(email, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getMe() {
  return request("/auth/me");
}

// Projects
export function getProjects() {
  return request("/projects");
}

export function createProject(data) {
  return request("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getProject(id) {
  return request(`/projects/${id}`);
}

export function updateProject(id, data) {
  return request(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function deleteProject(id) {
  return request(`/projects/${id}`, { method: "DELETE" });
}

// Photos
export function getProjectPhotos(projectId) {
  return request(`/photos/project/${projectId}`);
}

export function addPhoto(projectId, data) {
  return request(`/photos/project/${projectId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function deletePhoto(id) {
  return request(`/photos/${id}`, { method: "DELETE" });
}

export function getPhotoAnalysis(id) {
  return request(`/photos/${id}/analysis`);
}

// Reports
export function getProjectReports(projectId) {
  return request(`/reports/project/${projectId}`);
}

export function createReport(projectId, data) {
  return request(`/reports/project/${projectId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getReport(id) {
  return request(`/reports/${id}`);
}

export function updateReport(id, data) {
  return request(`/reports/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// AI
export function analyzePhoto(photoId) {
  return request(`/ai/analyze-photo/${photoId}`, { method: "POST" });
}

export function generateReportSummary(reportId) {
  return request(`/ai/generate-report/${reportId}`, { method: "POST" });
}

// Share
export function createShareLink(projectId, expiresInDays) {
  return request(`/share/project/${projectId}`, {
    method: "POST",
    body: JSON.stringify({ expiresInDays }),
  });
}

export function getSharedProject(token) {
  return request(`/share/${token}`);
}