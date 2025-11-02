const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let entries = [];

app.get("/", (req, res) => {
  res.send("");
});

app.post("/api/entries", (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: "ID and name are required" });
  }

  const newEntry = { id, name };
  entries.push(newEntry);
  res.status(201).json(newEntry);
});

app.get("/api/entries", (req, res) => {
  res.json(entries);
});

app.get("/api/check-team", (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ error: "Team name is required" });
  }
  const exists = entries.some(entry => entry.name.toLowerCase() === name.toLowerCase());
  res.json({ exists });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
