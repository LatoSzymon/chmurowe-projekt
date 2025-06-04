const express = require("express");
const router = express.Router();
const { dodajTeam, pobierzTeamy, usunTeam } = require("../controllers/teamsCon");

router.post("/", dodajTeam);
router.get("/", pobierzTeamy);
router.delete("/:id", usunTeam);
module.exports = router;
