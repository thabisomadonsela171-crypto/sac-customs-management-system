const express = require("express");

const router = express.Router();

const {
    getDashboardSummary,
    getRoleDashboard
} = require("../controllers/dashboardController");

// =====================================================
// GENERAL DASHBOARD
// GET /api/dashboard
// =====================================================

router.get(
    "/",
    getDashboardSummary
);

// =====================================================
// ROLE-SPECIFIC DASHBOARD
// GET /api/dashboard/role
// =====================================================

router.get(
    "/role",
    getRoleDashboard
);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;