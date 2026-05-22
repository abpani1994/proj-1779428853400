import { Router } from "express";
import prisma from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

// List photos for a project
router.get("/project/:projectId", async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const photos = await prisma.photo.findMany({
      where: { projectId: req.params.projectId },
      include: { analysis: true },
      orderBy: { takenAt: "desc" },
    });
    res.json(photos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Add photo to project
router.post("/project/:projectId", async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const { url, caption, location, takenAt } = req.body;
    if (!url) return res.status(400).json({ error: "Photo URL is required" });
    const photo = await prisma.photo.create({
      data: {
        url,
        caption: caption || null,
        location: location || null,
        takenAt: takenAt ? new Date(takenAt) : new Date(),
        projectId: req.params.projectId,
        userId: req.user.id,
      },
      include: { analysis: true },
    });
    res.status(201).json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete photo
router.delete("/:id", async (req, res) => {
  try {
    const photo = await prisma.photo.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!photo) return res.status(404).json({ error: "Photo not found" });
    await prisma.photo.delete({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: "Photo deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get analysis for photo
router.get("/:id/analysis", async (req, res) => {
  try {
    const photo = await prisma.photo.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { analysis: true },
    });
    if (!photo) return res.status(404).json({ error: "Photo not found" });
    if (!photo.analysis) return res.status(404).json({ error: "No analysis yet" });
    res.json(photo.analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;