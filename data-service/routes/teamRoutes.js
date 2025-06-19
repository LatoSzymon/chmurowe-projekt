const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requiredRole");
const express = require("express");
const router = express.Router();
const { dodajTeam, pobierzTeamy, usunTeam, pobierzTeamPoId } = require("../controllers/teamsCon");

router.get("/", pobierzTeamy);
router.get("/:id", pobierzTeamPoId);
router.post("/", verifyToken, requireRole("admin"), dodajTeam);
router.delete("/:id", verifyToken, requireRole("admin"), usunTeam);
module.exports = router;
