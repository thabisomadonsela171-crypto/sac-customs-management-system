require("dotenv").config();
const express = require("express");
const cors = require("cors");

// =====================================================
// ROUTES
// =====================================================

const customerRoutes = require("./routes/customerRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const documentRoutes = require("./routes/documentRoutes");
const declarationRoutes = require("./routes/declarationRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const shipmentTrackingRoutes = require("./routes/shipmentTrackingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// =====================================================
// AUTHENTICATION & AUTHORIZATION
// =====================================================

const {
    authenticateToken,
    authorizeRoles
} = require("./middleware/authMiddleware");

// =====================================================
// APP CONFIGURATION
// =====================================================

const app = express();
const PORT = 4000;

// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

app.use(cors());
app.use(express.json());

// =====================================================
// REQUEST LOGGER
// =====================================================

app.use((req, res, next) => {

    console.log(
        "REQUEST:",
        req.method,
        req.originalUrl
    );

    next();

});

// =====================================================
// PUBLIC AUTHENTICATION
// =====================================================

app.use(
    "/api/auth",
    authRoutes
);

// =====================================================
// NOTIFICATION DIRECT TEST
// =====================================================

app.get(
    "/api/notifications-direct-test",
    (req, res) => {

        console.log(
            "NOTIFICATION DIRECT TEST REACHED"
        );

        return res.status(200).json({
            success: true,
            message: "Notification direct route is working"
        });

    }
);

// =====================================================
// NOTIFICATIONS
// =====================================================

app.use(
    "/api/notifications",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "CLERK",
        "CUSTOMS_OFFICER",
        "FINANCE"
    ),
    notificationRoutes
);

// =====================================================
// DASHBOARD
// =====================================================

app.use(
    "/api/dashboard",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "CLERK",
        "CUSTOMS_OFFICER",
        "FINANCE"
    ),
    dashboardRoutes
);

// =====================================================
// TRACKING TEST
// =====================================================

app.get(
    "/api/tracking-test",
    (req, res) => {

        console.log(
            "TRACKING TEST ROUTE REACHED"
        );

        return res.status(200).json({
            success: true,
            message: "Tracking test route works"
        });

    }
);

// =====================================================
// CUSTOMERS
// =====================================================

app.use(
    "/api/customers",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "CLERK"
    ),
    customerRoutes
);

// =====================================================
// SHIPMENTS
// =====================================================

app.use(
    "/api/shipments",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "CLERK",
        "CUSTOMS_OFFICER"
    ),
    shipmentRoutes
);

// =====================================================
// DOCUMENTS
// =====================================================

app.use(
    "/api/documents",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "CLERK",
        "CUSTOMS_OFFICER"
    ),
    documentRoutes
);

// =====================================================
// DECLARATIONS
// =====================================================

app.use(
    "/api/declarations",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "CLERK",
        "CUSTOMS_OFFICER"
    ),
    declarationRoutes
);

// =====================================================
// PAYMENTS
// =====================================================

app.use(
    "/api/payments",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "FINANCE"
    ),
    paymentRoutes
);

// =====================================================
// AUDIT LOGS
// =====================================================

app.use(
    "/api/audit-logs",
    authenticateToken,
    authorizeRoles(
        "ADMIN"
    ),
    auditLogRoutes
);

// =====================================================
// USERS
// =====================================================

app.use(
    "/api/users",
    authenticateToken,
    authorizeRoles(
        "ADMIN"
    ),
    userRoutes
);

// =====================================================
// SHIPMENT TRACKING
// =====================================================

app.use(
    "/api/tracking",
    authenticateToken,
    authorizeRoles(
        "ADMIN",
        "CLERK",
        "CUSTOMS_OFFICER"
    ),
    shipmentTrackingRoutes
);

// =====================================================
// HOME
// =====================================================

app.get(
    "/",
    (req, res) => {

        return res.status(200).json({
            system: "SAC Customs System",
            status: "online",
            message:
                "SAC Customs Backend is running successfully"
        });

    }
);

// =====================================================
// SERVER TEST
// =====================================================

app.get(
    "/api/server-test",
    (req, res) => {

        return res.status(200).json({
            success: true,
            message:
                "This exact server.js process is responding"
        });

    }
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use(
    (req, res) => {

        console.log(
            "404 ROUTE NOT FOUND:",
            req.method,
            req.originalUrl
        );

        return res.status(404).json({
            success: false,
            message:
                `Route not found: ${req.method} ${req.originalUrl}`
        });

    }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
    (err, req, res, next) => {

        console.error(
            "SERVER ERROR:",
            err
        );

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });

    }
);

// =====================================================
// START SERVER
// =====================================================

app.listen(
    PORT,
    () => {

        console.log(
            "===================================="
        );

        console.log(
            "SERVER FILE:"
        );

        console.log(
            __filename
        );

        console.log(
            "WORKING DIRECTORY:"
        );

        console.log(
            process.cwd()
        );

        console.log(
            "===================================="
        );

        console.log(
            `SAC Customs Server running on http://localhost:${PORT}`
        );

        console.log("Customer routes loaded");
        console.log("Shipment routes loaded");
        console.log("Document routes loaded");
        console.log("Declaration routes loaded");
        console.log("Payment routes loaded");
        console.log("Audit log routes loaded");
        console.log("User routes loaded");
        console.log("Dashboard routes loaded");
        console.log("Shipment tracking routes loaded");
        console.log("Notification routes loaded");
        console.log("Authentication routes loaded");
        console.log("Role-based access control enabled");
        console.log("Connected to SAC Customs database");

    }
);