const db = require("../config/database");

const AuditLog = {

    // =====================================================
    // CREATE AUDIT LOG
    // =====================================================

    create: (log, callback) => {

        const sql = `
            INSERT INTO audit_logs
            (
                user_id,
                action,
                entity_type,
                entity_id,
                description,
                ip_address
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            log.user_id ?? null,
            log.action,
            log.entity_type,
            log.entity_id ?? null,
            log.description ?? null,
            log.ip_address ?? null
        ];

        db.run(sql, values, function (err) {

            if (err) {
                console.error(
                    "Audit log creation error:",
                    err.message
                );

                return callback(err);
            }

            const newLog = {
                id: this.lastID,
                user_id: log.user_id ?? null,
                action: log.action,
                entity_type: log.entity_type,
                entity_id: log.entity_id ?? null,
                description: log.description ?? null,
                ip_address: log.ip_address ?? null
            };

            callback(null, newLog);
        });
    },


    // =====================================================
    // CREATE SYSTEM AUDIT LOG
    // =====================================================

    createSystemLog: (
        action,
        entity_type,
        entity_id,
        description,
        callback
    ) => {

        const sql = `
            INSERT INTO audit_logs
            (
                user_id,
                action,
                entity_type,
                entity_id,
                description,
                ip_address
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            null,
            action,
            entity_type,
            entity_id ?? null,
            description ?? null,
            null
        ];

        db.run(sql, values, function (err) {

            if (err) {

                console.error(
                    "System audit log creation error:",
                    err.message
                );

                if (callback) {
                    callback(err);
                }

                return;
            }

            const newLog = {
                id: this.lastID,
                user_id: null,
                action: action,
                entity_type: entity_type,
                entity_id: entity_id ?? null,
                description: description ?? null,
                ip_address: null
            };

            if (callback) {
                callback(null, newLog);
            }

        });
    },


    // =====================================================
    // GET ALL AUDIT LOGS
    // =====================================================

    getAll: (callback) => {

        const sql = `
            SELECT
                audit_logs.id,
                audit_logs.user_id,
                audit_logs.action,
                audit_logs.entity_type,
                audit_logs.entity_id,
                audit_logs.description,
                audit_logs.ip_address,
                audit_logs.created_at,
                users.username
            FROM audit_logs
            LEFT JOIN users
                ON audit_logs.user_id = users.id
            ORDER BY audit_logs.id DESC
        `;

        db.all(sql, [], (err, rows) => {

            if (err) {

                console.error(
                    "Get all audit logs error:",
                    err.message
                );

                return callback(err);
            }

            callback(null, rows || []);
        });
    },


    // =====================================================
    // GET AUDIT LOGS FOR ENTITY
    // =====================================================

    getByEntity: (
        entity_type,
        entity_id,
        callback
    ) => {

        const sql = `
            SELECT
                audit_logs.id,
                audit_logs.user_id,
                audit_logs.action,
                audit_logs.entity_type,
                audit_logs.entity_id,
                audit_logs.description,
                audit_logs.ip_address,
                audit_logs.created_at,
                users.username
            FROM audit_logs
            LEFT JOIN users
                ON audit_logs.user_id = users.id
            WHERE audit_logs.entity_type = ?
            AND audit_logs.entity_id = ?
            ORDER BY audit_logs.id DESC
        `;

        db.all(
            sql,
            [entity_type, entity_id],
            (err, rows) => {

                if (err) {

                    console.error(
                        "Get audit logs by entity error:",
                        err.message
                    );

                    return callback(err);
                }

                callback(null, rows || []);
            }
        );
    },


    // =====================================================
    // GET AUDIT LOG BY ID
    // =====================================================

    getById: (id, callback) => {

        const sql = `
            SELECT
                audit_logs.id,
                audit_logs.user_id,
                audit_logs.action,
                audit_logs.entity_type,
                audit_logs.entity_id,
                audit_logs.description,
                audit_logs.ip_address,
                audit_logs.created_at,
                users.username
            FROM audit_logs
            LEFT JOIN users
                ON audit_logs.user_id = users.id
            WHERE audit_logs.id = ?
        `;

        db.get(sql, [id], (err, row) => {

            if (err) {

                console.error(
                    "Get audit log by ID error:",
                    err.message
                );

                return callback(err);
            }

            callback(null, row || null);
        });
    }

};


// =====================================================
// DEBUG INFORMATION
// =====================================================

console.log("====================================");
console.log("AUDIT LOG MODEL LOADED");
console.log(
    "AUDIT MODEL FILE:",
    __filename
);
console.log(
    "create:",
    typeof AuditLog.create
);
console.log(
    "createSystemLog:",
    typeof AuditLog.createSystemLog
);
console.log(
    "getAll:",
    typeof AuditLog.getAll
);
console.log(
    "getByEntity:",
    typeof AuditLog.getByEntity
);
console.log(
    "getById:",
    typeof AuditLog.getById
);
console.log("====================================");


// =====================================================
// EXPORT MODEL
// =====================================================

module.exports = AuditLog;