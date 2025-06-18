const verifyToken = require("../middleware/verifyToken");
const requireRole = require("../middleware/requiredRole");

const express = require("express");
const router = express.Router();
const { pokazujGraczy, dodajGracza, usunGracza, edytujGracza } = require("../controllers/playersCon");

router.get("/", pokazujGraczy);
router.post("/", verifyToken, requireRole("admin"), dodajGracza);
router.delete("/:id", verifyToken, requireRole("admin"), usunGracza);
router.patch("/:id", verifyToken, requireRole("admin"), edytujGracza);


module.exports = router;
