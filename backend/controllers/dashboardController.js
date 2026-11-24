const Dashboard = require("../models/dashboardModel");

// =====================================================
// GENERAL DASHBOARD
// =====================================================

const getDashboardSummary = (req, res) => {

    Dashboard.getSummary((err, summary) => {

        if (err) {

            console.error(
                "Dashboard controller error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve dashboard summary",
                error: err.message
            });

        }

        return res.status(200).json({
            success: true,
            message: "Dashboard summary retrieved successfully",
            dashboard: summary
        });

    });

};

// =====================================================
// ROLE-SPECIFIC DASHBOARD
// =====================================================

const getRoleDashboard = (req, res) => {

    const role = req.user.role;

    console.log(
        "ROLE DASHBOARD REQUEST:",
        role
    );

    switch (role) {

        // =============================================
        // ADMIN
        // =============================================

        case "ADMIN":

            Dashboard.getAdminDashboard((err, dashboard) => {

                if (err) {

                    console.error(
                        "Admin dashboard error:",
                        err.message
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Failed to retrieve Admin dashboard",
                        error: err.message
                    });

                }

                return res.status(200).json({
                    success: true,
                    role: "ADMIN",
                    message:
                        "Admin dashboard retrieved successfully",
                    dashboard
                });

            });

            break;

        // =============================================
        // CLERK
        // =============================================

        case "CLERK":

            Dashboard.getClerkDashboard((err, dashboard) => {

                if (err) {

                    console.error(
                        "Clerk dashboard error:",
                        err.message
                    );

                    return res.status(500).json({
                        success: false,
                        message:
                            "Failed to retrieve Clerk dashboard",
                        error: err.message
                    });

                }

                return res.status(200).json({
                    success: true,
                    role: "CLERK",
                    message:
                        "Clerk dashboard retrieved successfully",
                    dashboard
                });

            });

            break;

        // =============================================
        // CUSTOMS OFFICER
        // =============================================

        case "CUSTOMS_OFFICER":

            Dashboard.getCustomsOfficerDashboard(
                (err, dashboard) => {

                    if (err) {

                        console.error(
                            "Customs officer dashboard error:",
                            err.message
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "Failed to retrieve Customs Officer dashboard",
                            error: err.message
                        });

                    }

                    return res.status(200).json({
                        success: true,
                        role: "CUSTOMS_OFFICER",
                        message:
                            "Customs Officer dashboard retrieved successfully",
                        dashboard
                    });

                }
            );

            break;

        // =============================================
        // FINANCE
        // =============================================

        case "FINANCE":

            Dashboard.getFinanceDashboard(
                (err, dashboard) => {

                    if (err) {

                        console.error(
                            "Finance dashboard error:",
                            err.message
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "Failed to retrieve Finance dashboard",
                            error: err.message
                        });

                    }

                    return res.status(200).json({
                        success: true,
                        role: "FINANCE",
                        message:
                            "Finance dashboard retrieved successfully",
                        dashboard
                    });

                }
            );

            break;

        // =============================================
        // UNKNOWN ROLE
        // =============================================

        default:

            return res.status(403).json({
                success: false,
                message:
                    `Dashboard not available for role: ${role}`
            });

    }

};

// =====================================================
// EXPORT CONTROLLERS
// =====================================================

module.exports = {
    getDashboardSummary,
    getRoleDashboard
};