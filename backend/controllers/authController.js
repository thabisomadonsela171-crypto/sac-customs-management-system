
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =====================================================
// JWT SECRET
// =====================================================

const { JWT_SECRET } = require("../config/auth");


// =====================================================
// LOGIN
// =====================================================

const login = (req, res) => {

    const {
        username,
        password
    } = req.body;


    // Validate input
    if (!username || !password) {

        return res.status(400).json({
            success: false,
            message: "Username and password are required"
        });

    }


    // Find user
    User.getByUsername(username, async (err, user) => {

        if (err) {

            console.error(
                "Login database error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Login failed",
                error: err.message
            });

        }


        // User does not exist
        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });

        }


        // Check account status
        if (user.status !== "ACTIVE") {

            return res.status(403).json({
                success: false,
                message: `Account is ${user.status.toLowerCase()}`
            });

        }


        try {

            // Compare password
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );


            if (!passwordMatch) {

                return res.status(401).json({
                    success: false,
                    message: "Invalid username or password"
                });

            }


            // Create JWT
            const token = jwt.sign(
                {
                    id: user.id,
                    user_number: user.user_number,
                    username: user.username,
                    role: user.role
                },
                JWT_SECRET,
                {
                    expiresIn: "8h"
                }
            );


            // Remove password
            delete user.password;


            // Successful login
            return res.json({
                success: true,
                message: "Login successful",
                token,
                user
            });

        } catch (error) {

            console.error(
                "Authentication error:",
                error.message
            );

            return res.status(500).json({
                success: false,
                message: "Authentication failed"
            });

        }

    });

};


// =====================================================
// GET CURRENT USER
// =====================================================

const getCurrentUser = (req, res) => {

    res.json({
        success: true,
        user: req.user
    });

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    login,
    getCurrentUser
};

