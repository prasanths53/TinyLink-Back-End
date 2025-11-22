const express=require("express")

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ ok: true, version: "1.0", uptime: process.uptime(),
    timestamp: new Date() });
});

module.exports = router;
