import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./config/db.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import photoRoutes from "./routes/photos.js";
import reportRoutes from "./routes/reports.js";
import shareRoutes from "./routes/share.js";
import aiRoutes from "./routes/ai.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Security
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10mb" }));

// Rate limiting
const authLimiter = rateLimit({ windowMs: 60000, max: 10 });
const apiLimiter = rateLimit({ windowMs: 60000, max: 100 });

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// Health check (S4)
app.get("/api/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "ok" });
  } catch {
    res.status(503).json({ status: "down", db: "fail" });
  }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/share", shareRoutes);
app.use("/api/ai", aiRoutes);

// SPA static serving (S6)
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Error sanitization (S10)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

// Start server
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`SiteSnap API running on port ${PORT}`);
});

// Graceful shutdown (S11)
process.on("SIGTERM", () => {
  server.close(() => prisma.$disconnect());
});
process.on("SIGINT", () => {
  server.close(() => prisma.$disconnect());
});

export default app;