import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import prisma from "../config/db.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();
router.use(authMiddleware);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Analyze a photo with AI
router.post("/analyze-photo/:photoId", async (req, res) => {
  try {
    const photo = await prisma.photo.findFirst({
      where: { id: req.params.photoId, userId: req.user.id },
      include: { project: true },
    });
    if (!photo) return res.status(404).json({ error: "Photo not found" });

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "url", url: photo.url },
            },
            {
              type: "text",
              text: `You are a construction progress analyst. Analyze this jobsite photo for the project "${photo.project.name}" (${photo.project.description || "no description"}).

Return a JSON object with these fields:
- progressPercent: estimated overall completion percentage (0-100)
- detectedItems: array of strings listing visible construction elements (e.g. "framing complete", "roofing in progress", "electrical rough-in visible")
- complianceFlags: array of strings listing any safety or compliance concerns (e.g. "no hard hats visible", "scaffolding appears unsecured")
- summary: a 2-3 sentence progress summary
- scheduleAlert: null if on track, or a string describing potential delay concerns

Return ONLY valid JSON, no markdown fences.`,
            },
          ],
        },
      ],
    });

    let analysisData;
    try {
      const text = message.content[0].text;
      analysisData = JSON.parse(text);
    } catch {
      analysisData = {
        progressPercent: null,
        detectedItems: [],
        complianceFlags: [],
        summary: message.content[0].text,
        scheduleAlert: null,
      };
    }

    const analysis = await prisma.photoAnalysis.upsert({
      where: { photoId: photo.id },
      update: {
        progressPercent: analysisData.progressPercent,
        detectedItems: analysisData.detectedItems,
        complianceFlags: analysisData.complianceFlags,
        summary: analysisData.summary,
        scheduleAlert: analysisData.scheduleAlert,
      },
      create: {
        photoId: photo.id,
        progressPercent: analysisData.progressPercent,
        detectedItems: analysisData.detectedItems,
        complianceFlags: analysisData.complianceFlags,
        summary: analysisData.summary,
        scheduleAlert: analysisData.scheduleAlert,
      },
    });

    res.json(analysis);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Generate AI daily report summary
router.post("/generate-report/:reportId", async (req, res) => {
  try {
    const report = await prisma.dailyReport.findFirst({
      where: { id: req.params.reportId, userId: req.user.id },
      include: { project: true },
    });
    if (!report) return res.status(404).json({ error: "Report not found" });

    const recentPhotos = await prisma.photo.findMany({
      where: {
        projectId: report.projectId,
        takenAt: {
          gte: new Date(new Date(report.date).getTime() - 86400000),
          lte: new Date(new Date(report.date).getTime() + 86400000),
        },
      },
      include: { analysis: true },
      take: 5,
    });

    const photoContext = recentPhotos
      .filter((p) => p.analysis)
      .map((p) => `Photo: ${p.analysis.summary || "No summary"}`)
      .join("\n");

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `You are a construction project manager assistant. Generate a professional daily report summary.

Project: ${report.project.name}
Date: ${report.date}
Weather: ${report.weather || "Not recorded"}
Crew count: ${report.crewCount || "Not recorded"}
Work performed: ${report.workPerformed}
Issues: ${report.issues || "None reported"}
${photoContext ? `\nRecent photo analyses:\n${photoContext}` : ""}

Write a concise, professional summary (3-4 sentences) suitable for a client-facing progress report. Focus on concrete progress and any concerns.`,
        },
      ],
    });

    const aiSummary = message.content[0].text;
    const updated = await prisma.dailyReport.update({
      where: { id: report.id, userId: req.user.id },
      data: { aiSummary },
    });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;