import { Router } from "express";
import prisma from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.id },
      include: { _count: { select: { photos: true, dailyReports: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, address, description, startDate, endDate } = req.body;
    if (!name) return res.status(400).json({ error: "Project name is required" });
    const project = await prisma.project.create({
      data: {
        name,
        address: address || null,
        description: description || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        userId: req.user.id,
      },
    });
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: {
        photos: { include: { analysis: true }, orderBy: { takenAt: "desc" } },
        dailyReports: { orderBy: { date: "desc" } },
        shareLinks: true,
        _count: { select: { photos: true, dailyReports: true } },
      },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, address, description, status, startDate, endDate } = req.body;
    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: "Project not found" });
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name: name || existing.name,
        address: address !== undefined ? address : existing.address,
        description: description !== undefined ? description : existing.description,
        status: status || existing.status,
        startDate: startDate ? new Date(startDate) : existing.startDate,
        endDate: endDate ? new Date(endDate) : existing.endDate,
      },
    });
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const existing = await prisma.project.findFirst({
      where: { id: req.params.id, userId: req.user.id },
    });
    if (!existing) return res.status(404).json({ error: "Project not found" });
    await prisma.project.delete({ where: { id: req.params.id, userId: req.user.id } });
    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;