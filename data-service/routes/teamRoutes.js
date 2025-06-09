const express = require("express");
const router = express.Router();
const { dodajTeam, pobierzTeamy, usunTeam, pobierzTeamPoId } = require("../controllers/teamsCon");

router.post("/", dodajTeam);
router.get("/", pobierzTeamy);
router.get("/:id", pobierzTeamPoId);
router.delete("/:id", usunTeam);
module.exports = router;
