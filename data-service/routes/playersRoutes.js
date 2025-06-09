const express = require("express");
const router = express.Router();
const { pokazujGraczy, dodajGracza, usunGracza, edytujGracza } = require("../controllers/playersCon");

router.get("/", pokazujGraczy);
router.post("/", dodajGracza);
router.delete("/:id", usunGracza);
router.patch("/:id", edytujGracza);


module.exports = router;
