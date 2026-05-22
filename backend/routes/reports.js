import { Router } from "express";
import prisma from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

// List daily reports for project
router.get("/project/:projectId", async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const reports = await prisma.dailyReport.findMany({
      where: { projectId: req.params.projectId },
      orderBy: { date: "desc" },
    });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Create daily report
router.post("/project/:projectId", async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const { date, weather, crewCount, workPerformed, issues } = req.body;
    if (!workPerformed) return res.status(400).json({ error: "Work performed is required" });
    const report = await prisma.dailyReport.create({
      data: {
        date: date ? new Date(date) : new Date(),
        weather: weather || null,
        crewCount: crewCount ? parseInt(crewCount, 10) : null,
        workPerformed,
        issues: issues || null,
        projectId: req.params.projectId,
        userId: req.user.id,
      },
    });
    res.status(201).json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get single report
router.get("/:id", async (req, res) => {
  try {
    const report = await prisma.dailyReport.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update report
router.put("/:id", async (req, res) => {
  try {
    const existing = await prisma.dailyReport.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: "Report not found" });
    const { date, weather, crewCount, workPerformed, issues, aiSummary } = req.body;
    const report = await prisma.dailyReport.update({
      where: { id: req.params.id },
      data: {
        date: date ? new Date(date) : existing.date,
        weather: weather !== undefined ? weather : existing.weather,
        crewCount: crewCount !== undefined ? parseInt(crewCount, 10) : existing.crewCount,
        workPerformed: workPerformed || existing.workPerformed,
        issues: issues !== undefined ? issues : existing.issues,
        aiSummary: aiSummary !== undefined ? aiSummary : existing.aiSummary,
      },
    });
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;