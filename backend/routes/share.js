import { Router } from "express";
import crypto from "crypto";
import prisma from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Generate share link (auth required)
router.post("/project/:projectId", authMiddleware, async (req, res) => {
  try {
    const project = await prisma.project.findFirst({
      where: { id: req.params.projectId, userId: req.user.id },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    const token = crypto.randomBytes(32).toString("hex");
    const { expiresInDays } = req.body;
    const expiresAt = expiresInDays
      ? new Date(Date.now() + parseInt(expiresInDays, 10) * 86400000)
      : null;
    const shareLink = await prisma.shareLink.create({
      data: {
        projectId: req.params.projectId,
        token,
        expiresAt,
      },
    });
    res.status(201).json(shareLink);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Access shared project (public)
router.get("/:token", async (req, res) => {
  try {
    const shareLink = await prisma.shareLink.findUnique({
      where: { token: req.params.token },
    });
    if (!shareLink || !shareLink.isActive) {
      return res.status(404).json({ error: "Share link not found or inactive" });
    }
    if (shareLink.expiresAt && new Date() > shareLink.expiresAt) {
      return res.status(410).json({ error: "Share link has expired" });
    }
    const project = await prisma.project.findFirst({
      where: { id: shareLink.projectId, userId: req.user.id },
      include: {
        photos: { include: { analysis: true }, orderBy: { takenAt: "desc" } },
        dailyReports: { orderBy: { date: "desc" } },
      },
    });
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json({
      project: {
        name: project.name,
        address: project.address,
        description: project.description,
        status: project.status,
        photos: project.photos,
        dailyReports: project.dailyReports,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;