const express = require("express");
const router = express.Router();
const { pool } = require("../src/db");


function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Create short link
router.post("/", async (req, res) => {
  try {
    const { url, code } = req.body;

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

     try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    let shortCode = code || generateCode();

    const exists = await pool.query(
      "SELECT code FROM links WHERE code = $1",
      [shortCode]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: "Code already exists" });
    }

    await pool.query(
      "INSERT INTO links (code, url) VALUES ($1, $2)",
      [shortCode, url]
    );

    res.status(201).json({ code: shortCode, url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// List all links
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM links ORDER BY created_at DESC");
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Stats of one code
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    const result = await pool.query(
      "SELECT * FROM links WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete link
router.delete("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    await pool.query("DELETE FROM links WHERE code = $1", [code]);

    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
