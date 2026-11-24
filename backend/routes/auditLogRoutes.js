const express = require("express");

const router = express.Router();

const {
    createAuditLog,
    getAuditLogs,
    getAuditLog,
    getEntityAuditLogs
} = require("../controllers/auditLogController");

router.post("/", createAuditLog);

router.get("/", getAuditLogs);

router.get(
    "/entity/:entity_type/:entity_id",
    getEntityAuditLogs
);

router.get("/:id", getAuditLog);

module.exports = router;