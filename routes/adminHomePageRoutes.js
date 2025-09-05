const {
  getDashboardStats, getSalesOverTime
} = require("../controllers/adminHomePageController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const express = require("express");
const router = express.Router();

router.get("/dashboard-stats", protect, isAdmin, getDashboardStats);
router.get("/sales", protect, isAdmin, getSalesOverTime);

module.exports = router;