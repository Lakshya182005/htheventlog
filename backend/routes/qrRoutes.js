import express from "express";
import { PrismaClient } from "@prisma/client";
import { Team } from "../moduls/Team.js";
import { Level } from "../moduls/Level.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * @route POST /scan/:cohort/:level
 * @body { teamId: string }
 */
router.post("/scan/:cohort/:level", async (req, res) => {
  try {
    const { teamId } = req.body;
    const { cohort, level } = req.params;

    if (!teamId) {
      return res.status(400).json({ error: "Missing team ID" });
    }

    const numericLevel = parseInt(level);
    const numericCohort = parseInt(cohort);

    // 🔍 Find team
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: "Team not found" });

    // 🔍 Ensure team belongs to same cohort
    if (team.cohortId !== numericCohort) {
      return res
        .status(403)
        .json({ error: "This QR code does not belong to your cohort" });
    }

    // 🔍 Find QR code
    const qr = await prisma.qRCode.findFirst({
      where: { level: numericLevel, cohortId: numericCohort },
    });

    if (!qr) {
      return res
        .status(404)
        .json({ error: "Invalid QR or level not registered" });
    }

    // 🔐 Check if limit is reached
    if (qr.currentTeams >= qr.limit) {
      return res
        .status(400)
        .json({ error: "You're late! This QR is no longer active." });
    }

    // 🔁 Check if already completed
    const completed = await Level.isCompleted(team.id, numericLevel);
    if (completed) {
      return res
        .status(400)
        .json({ error: "This level is already completed." });
    }

    // 🧩 Sequential level check
    if (numericLevel !== team.currentLevel + 1) {
      return res.status(400).json({
        error: `You must complete level ${team.currentLevel + 1} next.`,
      });
    }

    // ✅ Mark completion using Level.js logic (updates both team & QR)
    const updatedTeam = await Level.markCompleted(team.id, numericLevel);

    res.json({
      message: `🎉 Level ${numericLevel} completed successfully for Cohort ${numericCohort}!`,
      team: {
        id: updatedTeam.id,
        currentLevel: updatedTeam.currentLevel,
      },
    });
  } catch (err) {
    console.error("❌ Scan route error:", err);
    res.status(500).json({
      error: "Server error during scan",
      details: err.message,
    });
  }
});

export default router;
