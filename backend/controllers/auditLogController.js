const AuditLog = require("../models/auditLogModel");

// =====================================================
// DEBUG - VERIFY AUDIT MODEL
// =====================================================

console.log("====================================");
console.log("AUDIT CONTROLLER LOADED");
console.log(
    "AUDIT MODEL PATH:",
    require.resolve("../models/auditLogModel")
);
console.log(
    "AUDIT MODEL METHODS:",
    Object.keys(AuditLog)
);
console.log(
    "AuditLog.getAll TYPE:",
    typeof AuditLog.getAll
);
console.log(
    "AuditLog.getById TYPE:",
    typeof AuditLog.getById
);
console.log(
    "AuditLog.getByEntity TYPE:",
    typeof AuditLog.getByEntity
);
console.log("====================================");


// =====================================================
// CREATE AUDIT LOG
// =====================================================

const createAuditLog = (req, res) => {

    const {
        user_id,
        action,
        entity_type,
        entity_id,
        description,
        ip_address
    } = req.body;

    if (!action || !entity_type) {
        return res.status(400).json({
            success: false,
            message: "Action and entity type are required"
        });
    }

    const log = {
        user_id: user_id ?? null,
        action,
        entity_type,
        entity_id: entity_id ?? null,
        description: description ?? null,
        ip_address: ip_address || req.ip
    };

    console.log("Creating audit log:", log);

    AuditLog.create(log, (err, newLog) => {

        if (err) {

            console.error(
                "Audit log creation error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to create audit log",
                error: err.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Audit log created successfully",
            audit_log: newLog
        });
    });
};


// =====================================================
// GET ALL AUDIT LOGS
// =====================================================

const getAuditLogs = (req, res) => {

    console.log("====================================");
    console.log("GET /api/audit-logs");
    console.log(
        "AuditLog object:",
        AuditLog
    );
    console.log(
        "AuditLog.getAll:",
        AuditLog.getAll
    );
    console.log(
        "AuditLog.getAll TYPE:",
        typeof AuditLog.getAll
    );
    console.log("====================================");

    // Safety check
    if (typeof AuditLog.getAll !== "function") {

        console.error(
            "CRITICAL ERROR: AuditLog.getAll is not a function"
        );

        return res.status(500).json({
            success: false,
            message: "Audit log model is not loaded correctly",
            error: "AuditLog.getAll is not a function"
        });
    }

    AuditLog.getAll((err, logs) => {

        if (err) {

            console.error(
                "Get audit logs error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve audit logs",
                error: err.message
            });
        }

        return res.json({
            success: true,
            count: logs ? logs.length : 0,
            audit_logs: logs || []
        });
    });
};


// =====================================================
// GET AUDIT LOG BY ID
// =====================================================

const getAuditLog = (req, res) => {

    const { id } = req.params;

    console.log(
        "Getting audit log ID:",
        id
    );

    if (typeof AuditLog.getById !== "function") {

        return res.status(500).json({
            success: false,
            message: "Audit log model is not loaded correctly",
            error: "AuditLog.getById is not a function"
        });
    }

    AuditLog.getById(id, (err, log) => {

        if (err) {

            console.error(
                "Get audit log by ID error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve audit log",
                error: err.message
            });
        }

        if (!log) {

            return res.status(404).json({
                success: false,
                message: "Audit log not found"
            });
        }

        return res.json({
            success: true,
            audit_log: log
        });
    });
};


// =====================================================
// GET AUDIT LOGS FOR ENTITY
// =====================================================

const getEntityAuditLogs = (req, res) => {

    const {
        entity_type,
        entity_id
    } = req.params;

    console.log(
        "Getting audit logs:",
        entity_type,
        entity_id
    );

    if (typeof AuditLog.getByEntity !== "function") {

        return res.status(500).json({
            success: false,
            message: "Audit log model is not loaded correctly",
            error: "AuditLog.getByEntity is not a function"
        });
    }

    AuditLog.getByEntity(
        entity_type,
        entity_id,
        (err, logs) => {

            if (err) {

                console.error(
                    "Get entity audit logs error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to retrieve entity audit logs",
                    error: err.message
                });
            }

            return res.json({
                success: true,
                count: logs ? logs.length : 0,
                audit_logs: logs || []
            });
        }
    );
};


// =====================================================
// EXPORT CONTROLLER
// =====================================================

module.exports = {
    createAuditLog,
    getAuditLogs,
    getAuditLog,
    getEntityAuditLogs
};