
const AuditLog = require("../models/auditLogModel");

/**
 * Automatically create an audit log.
 *
 * @param {Object} req Express request
 * @param {String} action Action performed
 * @param {String} entityType Entity type
 * @param {Number|null} entityId Entity ID
 * @param {String} description Description of the action
 */
const createAuditLog = (
    req,
    action,
    entityType,
    entityId = null,
    description = null
) => {

    // Get logged-in user from JWT middleware
    const userId = req.user ? req.user.id : null;

    // Get client IP address
    const ipAddress =
        req.ip ||
        req.headers["x-forwarded-for"] ||
        req.connection?.remoteAddress ||
        null;

    const log = {
        user_id: userId,
        action,
        entity_type: entityType,
        entity_id: entityId,
        description,
        ip_address: ipAddress
    };

    AuditLog.create(log, (err, newLog) => {

        if (err) {
            // Audit failure should NOT crash the main request
            console.error(
                "Audit logging error:",
                err.message
            );

            return;
        }

        console.log(
            `AUDIT: ${action} ${entityType} #${entityId || "-"}`
        );
    });
};

module.exports = createAuditLog;

