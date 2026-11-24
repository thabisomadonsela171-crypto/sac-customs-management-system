
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/auth");

// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

const authenticateToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader ? "PRESENT" : "MISSING");

    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Access token is required"
        });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({
            success: false,
            message: "Invalid authorization format. Use Bearer <token>"
        });
    }

    const token = parts[1];

    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        console.log(
            "JWT VERIFIED:",
            decoded.username,
            "ROLE:",
            decoded.role
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.error(
            "JWT verification error:",
            error.name,
            error.message
        );

        return res.status(403).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


// =====================================================
// ROLE AUTHORIZATION
// =====================================================

const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        console.log(
            "ROLE CHECK:",
            req.user ? req.user.role : "NO USER",
            "ALLOWED:",
            allowedRoles
        );

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        if (!allowedRoles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "You do not have permission to access this resource"
            });
        }

        next();
    };
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    authenticateToken,
    authorizeRoles
};

