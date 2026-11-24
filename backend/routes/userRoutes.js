
const express = require("express");

const router = express.Router();

const {
    createUser,
    getUsers,
    getUser,
    updateUserStatus,
    deleteUser
} = require("../controllers/userController");


// Create user
router.post("/", createUser);


// Get all users
router.get("/", getUsers);


// Get user by ID
router.get("/:id", getUser);


// Update user status
router.patch("/:id/status", updateUserStatus);


// Delete user
router.delete("/:id", deleteUser);


module.exports = router;
