const express = require("express");
const router = express.Router();
const { pokazujGraczy, dodajGracza, usunGracza } = require("../controllers/playersCon");

router.get("/", pokazujGraczy);
router.post("/", dodajGracza);
router.delete("/:id", usunGracza);

module.exports = router;
