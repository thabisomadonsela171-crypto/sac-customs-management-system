
const express = require("express");

const router = express.Router();

const {
    login,
    getCurrentUser
} = require("../controllers/authController");


// =====================================================
// LOGIN
// POST /api/auth/login
// =====================================================

router.post("/login", login);


// =====================================================
// CURRENT USER
// GET /api/auth/me
// =====================================================

router.get("/me", getCurrentUser);


module.exports = router;

