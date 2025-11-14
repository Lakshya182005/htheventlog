import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import qrRoutes from "./routes/qrRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { connectDB } from "./db.js";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/", qrRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ Server running" });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

export default app;
