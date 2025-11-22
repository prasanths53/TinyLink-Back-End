const express=require("express")

const {pool}=require("../src/db")


const router = express.Router();

router.get("/:code", async (req, res) => {
  const { code } = req.params;

  try {
    const result = await pool.query(
      "SELECT url, clicks FROM links WHERE code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Not found");
    }

    const url = result.rows[0].url;
    const clicks = result.rows[0].clicks;

    
    await pool.query(
      "UPDATE links SET clicks = $1, last_clicked = NOW() WHERE code = $2",
      [clicks + 1, code]
    );

    res.redirect(url);
  } catch {
    res.status(500).send("Server error");
  }
});

module.exports = router;