const db = require("../config/database");

const Notification = {

    // =====================================================
    // CREATE NOTIFICATION
    // =====================================================

    create: (
        userId,
        title,
        message,
        notificationType = "INFO",
        entityType = null,
        entityId = null,
        callback
    ) => {

        console.log("====================================");
        console.log("CREATE NOTIFICATION");
        console.log("USER ID:", userId);
        console.log("TITLE:", title);
        console.log("MESSAGE:", message);
        console.log("TYPE:", notificationType);
        console.log("ENTITY TYPE:", entityType);
        console.log("ENTITY ID:", entityId);
        console.log("====================================");

        // Make sure callback exists
        if (typeof callback !== "function") {

            console.error(
                "Notification creation error: callback is not a function"
            );

            return;
        }

        const sql = `
            INSERT INTO notifications (
                user_id,
                title,
                message,
                notification_type,
                entity_type,
                entity_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.run(
            sql,
            [
                userId,
                title,
                message,
                notificationType,
                entityType,
                entityId
            ],
            function (err) {

                if (err) {

                    console.error(
                        "===================================="
                    );

                    console.error(
                        "NOTIFICATION DATABASE ERROR:"
                    );

                    console.error(
                        err.message
                    );

                    console.error(
                        "===================================="
                    );

                    return callback(err);
                }

                console.log(
                    "===================================="
                );

                console.log(
                    "NOTIFICATION CREATED SUCCESSFULLY"
                );

                console.log(
                    "NOTIFICATION ID:",
                    this.lastID
                );

                console.log(
                    "USER ID:",
                    userId
                );

                console.log(
                    "===================================="
                );

                return callback(null, {

                    id: this.lastID,

                    user_id: userId,

                    title: title,

                    message: message,

                    notification_type:
                        notificationType,

                    entity_type:
                        entityType,

                    entity_id:
                        entityId,

                    is_read: 0

                });

            }
        );

    },


    // =====================================================
    // GET ALL NOTIFICATIONS FOR USER
    // =====================================================

    getByUserId: (userId, callback) => {

        const sql = `
            SELECT
                id,
                user_id,
                title,
                message,
                notification_type,
                entity_type,
                entity_id,
                is_read,
                created_at
            FROM notifications
            WHERE user_id = ?
            ORDER BY created_at DESC, id DESC
        `;

        db.all(
            sql,
            [userId],
            (err, rows) => {

                if (err) {

                    console.error(
                        "Get notifications error:",
                        err.message
                    );

                    return callback(err);
                }

                return callback(null, rows);
            }
        );

    },


    // =====================================================
    // GET UNREAD NOTIFICATIONS
    // =====================================================

    getUnreadByUserId: (userId, callback) => {

        const sql = `
            SELECT
                id,
                user_id,
                title,
                message,
                notification_type,
                entity_type,
                entity_id,
                is_read,
                created_at
            FROM notifications
            WHERE user_id = ?
              AND is_read = 0
            ORDER BY created_at DESC, id DESC
        `;

        db.all(
            sql,
            [userId],
            (err, rows) => {

                if (err) {

                    console.error(
                        "Get unread notifications error:",
                        err.message
                    );

                    return callback(err);
                }

                return callback(null, rows);
            }
        );

    },


    // =====================================================
    // COUNT UNREAD NOTIFICATIONS
    // =====================================================

    countUnread: (userId, callback) => {

        const sql = `
            SELECT
                COUNT(*) AS unread_count
            FROM notifications
            WHERE user_id = ?
              AND is_read = 0
        `;

        db.get(
            sql,
            [userId],
            (err, row) => {

                if (err) {

                    console.error(
                        "Count unread notifications error:",
                        err.message
                    );

                    return callback(err);
                }

                return callback(
                    null,
                    row ? row.unread_count : 0
                );
            }
        );

    },


    // =====================================================
    // MARK ONE NOTIFICATION AS READ
    // =====================================================

    markAsRead: (
        notificationId,
        userId,
        callback
    ) => {

        const sql = `
            UPDATE notifications
            SET is_read = 1
            WHERE id = ?
              AND user_id = ?
        `;

        db.run(
            sql,
            [
                notificationId,
                userId
            ],
            function (err) {

                if (err) {

                    console.error(
                        "Mark notification as read error:",
                        err.message
                    );

                    return callback(err);
                }

                return callback(null, {
                    changes: this.changes
                });
            }
        );

    },


    // =====================================================
    // MARK ALL NOTIFICATIONS AS READ
    // =====================================================

    markAllAsRead: (
        userId,
        callback
    ) => {

        const sql = `
            UPDATE notifications
            SET is_read = 1
            WHERE user_id = ?
              AND is_read = 0
        `;

        db.run(
            sql,
            [userId],
            function (err) {

                if (err) {

                    console.error(
                        "Mark all notifications as read error:",
                        err.message
                    );

                    return callback(err);
                }

                return callback(null, {
                    changes: this.changes
                });
            }
        );

    },


    // =====================================================
    // DELETE NOTIFICATION
    // =====================================================

    delete: (
        notificationId,
        userId,
        callback
    ) => {

        const sql = `
            DELETE FROM notifications
            WHERE id = ?
              AND user_id = ?
        `;

        db.run(
            sql,
            [
                notificationId,
                userId
            ],
            function (err) {

                if (err) {

                    console.error(
                        "Delete notification error:",
                        err.message
                    );

                    return callback(err);
                }

                return callback(null, {
                    changes: this.changes
                });
            }
        );

    }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = Notification;