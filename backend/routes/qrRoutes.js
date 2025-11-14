import express from "express";
import { Cohort } from "../models/Cohort.js";
import { Team } from "../models/Team.js";
import { QRCode } from "../models/QRCode.js";
import { Level } from "../moduls/Level.js";

const router = express.Router();

/**
 * NEW TOKEN-BASED SCAN ROUTE
 * POST /scan
 * body: { token, teamId }
 */
router.post("/scan", async (req, res) => {
  try {
    const { token, teamId } = req.body;

    if (!token) return res.status(400).json({ error: "Missing token" });
    if (!teamId) return res.status(400).json({ error: "Missing team ID" });

    // 1️⃣ Find the QR entry using token
    const qr = await QRCode.findOne({ token });
    if (!qr) {
      return res.status(404).json({ error: "Invalid or expired QR token" });
    }

    // 2️⃣ Find team
    const team = await Team.findOne({ id: teamId.trim() });
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    // 3️⃣ Validate cohort match
    if (String(team.cohortId) !== String(qr.cohortId)) {
      return res.status(403).json({
        error: "This QR does not belong to your cohort",
      });
    }

    // 4️⃣ Validate level sequence
    const expectedLevel = team.currentLevel + 1;
    if (qr.level !== expectedLevel) {
      return res.status(400).json({
        error: `You must complete Level ${expectedLevel} next.`,
      });
    }

    // 5️⃣ Check QR limit
    if (qr.currentTeams >= qr.limit) {
      return res.status(400).json({
        error: "You're late! This QR is no longer active.",
      });
    }

    // 6️⃣ Mark completed (updates Team + QR)
    const updatedTeam = await Level.markCompleted(team.id, qr.level);

    return res.json({
      message: `Level ${qr.level} completed successfully!`,
      flag: qr.flag,
      currentLevel: updatedTeam.currentLevel,
    });

  } catch (err) {
    console.error("❌ Token-based scan error:", err);
    return res.status(500).json({
      error: "Server error during scan",
      details: err.message,
    });
  }
});

export default router;