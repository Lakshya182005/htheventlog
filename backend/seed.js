// backend/seed.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import crypto from "crypto";
import { Cohort } from "./models/Cohort.js";
import { Team } from "./models/Team.js";
import { QRCode } from "./models/QRCode.js";
import { connectDB } from "./db.js";

async function main() {
  console.log("🚀 Starting secure MongoDB seeder...\n");

  await connectDB();
  console.log("🟢 Connected to MongoDB\n");

  // ======================================
  // 1️⃣ LOAD TEAM CSV
  // ======================================
  const teamCsvPath = path.join(process.cwd(), "teams.csv");
  const teamCsv = fs.readFileSync(teamCsvPath, "utf8");

  const teamParsed = Papa.parse(teamCsv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const teamRows = teamParsed.data;

  console.log(`📌 Found ${teamRows.length} teams\n`);

  for (const row of teamRows) {
  // 💡 Handle CSV header inconsistencies
  const teamUID =
    (row["Team UID"] || row["UID"] || row["id"] || "").trim();

  const cohortNum =
    (row["Cohort"] || row["Cohort "] || row["cohort"] || "").trim();

  const teamName =
    (row["Team Name"] || row["Name"] || "").trim();

  const level = parseInt(row["Level"] || row["level"] || "0");

  if (!teamUID || !cohortNum || !teamName) {
    console.log("⚠️ Skipping invalid row:", row);
    continue;
  }

  const cohortName = `Cohort ${cohortNum}`;

  let cohort = await Cohort.findOne({ name: cohortName });
  if (!cohort) {
    cohort = await Cohort.create({ name: cohortName });
  }

  const existingTeam = await Team.findOne({ id: teamUID });
  if (existingTeam) {
    console.log(`⚠️ Team ${teamUID} exists — skipping`);
    continue;
  }

  await Team.create({
    id: teamUID,
    name: teamName,
    currentLevel: level,
    cohortId: cohort._id,
  });

  console.log(`✅ Created team ${teamUID} (${cohortName})`);
}


  // ======================================
  // 2️⃣ LOAD QR CODE CSV
  // ======================================
  console.log("\n🚀 Seeding QR Codes...\n");

  const qrCsvPath = path.join(process.cwd(), "QRCode_Seed.csv");
  const qrCsv = fs.readFileSync(qrCsvPath, "utf8");

  const qrParsed = Papa.parse(qrCsv, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim(),
  });

  const qrRows = qrParsed.data;

  let successQR = 0,
      skipQR = 0,
      errorQR = 0;

  for (const row of qrRows) {
    try {
      const cohortNum = parseInt(row["cohortId"]);
      const level = parseInt(row["level"]);
      const flag = row["flag"]?.trim();
      const limit = parseInt(row["limit"]);

      if (!cohortNum || !level || !flag || isNaN(limit)) {
        console.log(`⚠ Skipping invalid QR row: ${JSON.stringify(row)}`);
        skipQR++;
        continue;
      }

      const cohort = await Cohort.findOne({ name: `Cohort ${cohortNum}` });
      if (!cohort) {
        console.log(`❌ No cohort found for numeric ID: ${cohortNum}`);
        continue;
      }

      // Generate a secure token
      const token = crypto.randomBytes(24).toString("hex");

      await QRCode.create({
        flag,
        level,
        limit,
        currentTeams: 0,
        cohortId: cohort._id,
        token,
      });

      console.log(`✅ Level ${level} | Cohort ${cohortNum} | Token assigned`);
      successQR++;
    } catch (err) {
      console.error(`✗ Error creating QR Code: ${err.message}`);
      errorQR++;
    }
  }

  console.log("\n🎉 SEEDING COMPLETE!");
  console.log(`QR Created: ${successQR}`);
  console.log(`QR Skipped: ${skipQR}`);
  console.log(`QR Errors:  ${errorQR}`);

  process.exit();
}

main();
