const db = require("../config/database");

// =====================================================
// DASHBOARD MODEL
// =====================================================

const Dashboard = {

    // =================================================
    // GENERAL SYSTEM SUMMARY
    // =================================================

    getSummary: (callback) => {

        const sql = `
            SELECT

                (SELECT COUNT(*)
                 FROM customers) AS total_customers,

                (SELECT COUNT(*)
                 FROM shipments) AS total_shipments,

                (SELECT COUNT(*)
                 FROM documents) AS total_documents,

                (SELECT COUNT(*)
                 FROM declarations) AS total_declarations,

                (SELECT COUNT(*)
                 FROM payments) AS total_payments,

                (SELECT COUNT(*)
                 FROM users) AS total_users,

                (SELECT COUNT(*)
                 FROM shipments
                 WHERE status = 'CLEARED') AS cleared_shipments,

                (SELECT COUNT(*)
                 FROM documents
                 WHERE status = 'PENDING') AS pending_documents,

                (SELECT COUNT(*)
                 FROM declarations
                 WHERE status = 'SUBMITTED') AS submitted_declarations,

                (SELECT COUNT(*)
                 FROM declarations
                 WHERE status = 'PROCESSING') AS processing_declarations,

                (SELECT COUNT(*)
                 FROM declarations
                 WHERE status = 'APPROVED') AS approved_declarations,

                (SELECT COUNT(*)
                 FROM declarations
                 WHERE status = 'CLEARED') AS cleared_declarations,

                (SELECT COUNT(*)
                 FROM payments
                 WHERE status = 'PENDING') AS pending_payments,

                (SELECT COUNT(*)
                 FROM payments
                 WHERE status = 'PROCESSING') AS processing_payments,

                (SELECT COUNT(*)
                 FROM payments
                 WHERE status = 'PAID') AS paid_payments,

                (SELECT COALESCE(SUM(amount), 0)
                 FROM payments
                 WHERE status = 'PAID') AS total_paid_amount
        `;

        db.get(sql, [], (err, row) => {

            if (err) {

                console.error(
                    "Dashboard summary error:",
                    err.message
                );

                return callback(err);

            }

            callback(null, row);

        });

    },

    // =================================================
    // ADMIN DASHBOARD
    // =================================================

    getAdminDashboard: (callback) => {

        const sql = `
            SELECT

                (SELECT COUNT(*)
                 FROM users) AS total_users,

                (SELECT COUNT(*)
                 FROM customers) AS total_customers,

                (SELECT COUNT(*)
                 FROM shipments) AS total_shipments,

                (SELECT COUNT(*)
                 FROM documents) AS total_documents,

                (SELECT COUNT(*)
                 FROM declarations) AS total_declarations,

                (SELECT COUNT(*)
                 FROM payments) AS total_payments,

                (SELECT COUNT(*)
                 FROM audit_logs) AS total_audit_logs,

                (SELECT COUNT(*)
                 FROM shipments
                 WHERE status = 'CLEARED') AS cleared_shipments,

                (SELECT COUNT(*)
                 FROM declarations
                 WHERE status = 'CLEARED') AS cleared_declarations,

                (SELECT COUNT(*)
                 FROM payments
                 WHERE status = 'PAID') AS paid_payments,

                (SELECT COALESCE(SUM(amount), 0)
                 FROM payments
                 WHERE status = 'PAID') AS total_paid_amount
        `;

        db.get(sql, [], (err, row) => {

            if (err) {

                console.error(
                    "Admin dashboard error:",
                    err.message
                );

                return callback(err);

            }

            callback(null, row);

        });

    },

    // =================================================
    // CLERK DASHBOARD
    // =================================================

    getClerkDashboard: (callback) => {

        const sql = `
            SELECT

                (SELECT COUNT(*)
                 FROM customers) AS total_customers,

                (SELECT COUNT(*)
                 FROM shipments) AS total_shipments,

                (SELECT COUNT(*)
                 FROM documents) AS total_documents,

                (SELECT COUNT(*)
                 FROM shipments
                 WHERE status = 'RECEIVED') AS received_shipments,

                (SELECT COUNT(*)
                 FROM shipments
                 WHERE status = 'IN_TRANSIT') AS in_transit_shipments,

                (SELECT COUNT(*)
                 FROM shipments
                 WHERE status = 'CLEARED') AS cleared_shipments,

                (SELECT COUNT(*)
                 FROM documents
                 WHERE status = 'PENDING') AS pending_documents,

                (SELECT COUNT(*)
                 FROM documents
                 WHERE status = 'VERIFIED') AS verified_documents
        `;

        db.get(sql, [], (err, row) => {

            if (err) {

                console.error(
                    "Clerk dashboard error:",
                    err.message
                );

                return callback(err);

            }

            callback(null, row);

        });

    },

    // =================================================
    // CUSTOMS OFFICER DASHBOARD
    // =================================================

    getCustomsOfficerDashboard: (callback) => {

        const sql = `
            SELECT

                (SELECT COUNT(*)
                 FROM shipments) AS total_shipments,

                (SELECT COUNT(*)
                 FROM declarations) AS total_declarations,

                (SELECT COUNT(*)
                 FROM declarations
                 WHERE status = 'SUBMITTED') AS submitted_declarations,

                (SELECT COUNT(*)
                 FROM declarations
                 WHERE status = 'PROCESSING') AS processing_declarations,

                (SELECT COUNT(*)
                 FROM declarations
                 WHERE status = 'APPROVED') AS approved_declarations,

                (SELECT COUNT(*)
                 FROM declarations
                 WHERE status = 'CLEARED') AS cleared_declarations,

                (SELECT COUNT(*)
                 FROM shipments
                 WHERE status = 'RECEIVED') AS received_shipments,

                (SELECT COUNT(*)
                 FROM shipments
                 WHERE status = 'IN_TRANSIT') AS in_transit_shipments,

                (SELECT COUNT(*)
                 FROM shipments
                 WHERE status = 'CLEARED') AS cleared_shipments
        `;

        db.get(sql, [], (err, row) => {

            if (err) {

                console.error(
                    "Customs officer dashboard error:",
                    err.message
                );

                return callback(err);

            }

            callback(null, row);

        });

    },

    // =================================================
    // FINANCE DASHBOARD
    // =================================================

    getFinanceDashboard: (callback) => {

        const sql = `
            SELECT

                (SELECT COUNT(*)
                 FROM payments) AS total_payments,

                (SELECT COUNT(*)
                 FROM payments
                 WHERE status = 'PENDING') AS pending_payments,

                (SELECT COUNT(*)
                 FROM payments
                 WHERE status = 'PROCESSING') AS processing_payments,

                (SELECT COUNT(*)
                 FROM payments
                 WHERE status = 'PAID') AS paid_payments,

                (SELECT COALESCE(SUM(amount), 0)
                 FROM payments
                 WHERE status = 'PAID') AS total_paid_amount,

                (SELECT COALESCE(SUM(amount), 0)
                 FROM payments
                 WHERE status = 'PENDING') AS pending_payment_amount,

                (SELECT COALESCE(SUM(amount), 0)
                 FROM payments
                 WHERE status = 'PROCESSING') AS processing_payment_amount
        `;

        db.get(sql, [], (err, row) => {

            if (err) {

                console.error(
                    "Finance dashboard error:",
                    err.message
                );

                return callback(err);

            }

            callback(null, row);

        });

    }

};

// =====================================================
// EXPORT
// =====================================================

module.exports = Dashboard;