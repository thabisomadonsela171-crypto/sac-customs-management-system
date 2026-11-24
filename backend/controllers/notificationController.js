const Notification = require("../models/notificationModel");

// =====================================================
// GET ALL NOTIFICATIONS FOR LOGGED-IN USER
// =====================================================
const getNotifications = (req, res) => {

    const userId = req.user.id;

    Notification.getByUserId(
        userId,
        (err, notifications) => {

            if (err) {

                console.error(
                    "Get notifications controller error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to retrieve notifications",
                    error: err.message
                });

            }

            return res.status(200).json({
                success: true,
                count: notifications.length,
                notifications
            });

        }
    );

};


// =====================================================
// GET UNREAD NOTIFICATIONS
// =====================================================
const getUnreadNotifications = (req, res) => {

    const userId = req.user.id;

    Notification.getUnreadByUserId(
        userId,
        (err, notifications) => {

            if (err) {

                console.error(
                    "Get unread notifications controller error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to retrieve unread notifications",
                    error: err.message
                });

            }

            return res.status(200).json({
                success: true,
                count: notifications.length,
                notifications
            });

        }
    );

};


// =====================================================
// GET UNREAD NOTIFICATION COUNT
// =====================================================
const getUnreadCount = (req, res) => {

    const userId = req.user.id;

    Notification.countUnread(
        userId,
        (err, count) => {

            if (err) {

                console.error(
                    "Unread notification count error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to retrieve unread notification count",
                    error: err.message
                });

            }

            return res.status(200).json({
                success: true,
                unread_count: count
            });

        }
    );

};


// =====================================================
// CREATE NOTIFICATION
// =====================================================
const createNotification = (req, res) => {

    const {
        user_id,
        title,
        message,
        notification_type,
        entity_type,
        entity_id
    } = req.body;

    if (!user_id || !title || !message) {

        return res.status(400).json({
            success: false,
            message:
                "user_id, title and message are required"
        });

    }

    Notification.create(
        user_id,
        title,
        message,
        notification_type || "INFO",
        entity_type || null,
        entity_id || null,
        (err, notification) => {

            if (err) {

                console.error(
                    "Create notification controller error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to create notification",
                    error: err.message
                });

            }

            return res.status(201).json({
                success: true,
                message: "Notification created successfully",
                notification
            });

        }
    );

};


// =====================================================
// MARK ONE NOTIFICATION AS READ
// =====================================================
const markNotificationAsRead = (req, res) => {

    const notificationId = req.params.id;
    const userId = req.user.id;

    Notification.markAsRead(
        notificationId,
        userId,
        (err, result) => {

            if (err) {

                console.error(
                    "Mark notification as read controller error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to mark notification as read",
                    error: err.message
                });

            }

            if (result.changes === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Notification not found or already read"
                });

            }

            return res.status(200).json({
                success: true,
                message:
                    "Notification marked as read"
            });

        }
    );

};


// =====================================================
// MARK ALL NOTIFICATIONS AS READ
// =====================================================
const markAllNotificationsAsRead = (req, res) => {

    const userId = req.user.id;

    Notification.markAllAsRead(
        userId,
        (err, result) => {

            if (err) {

                console.error(
                    "Mark all notifications as read controller error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to mark all notifications as read",
                    error: err.message
                });

            }

            return res.status(200).json({
                success: true,
                message:
                    "All notifications marked as read",
                updated_count: result.changes
            });

        }
    );

};


// =====================================================
// DELETE NOTIFICATION
// =====================================================
const deleteNotification = (req, res) => {

    const notificationId = req.params.id;
    const userId = req.user.id;

    Notification.delete(
        notificationId,
        userId,
        (err, result) => {

            if (err) {

                console.error(
                    "Delete notification controller error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to delete notification",
                    error: err.message
                });

            }

            if (result.changes === 0) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Notification not found"
                });

            }

            return res.status(200).json({
                success: true,
                message:
                    "Notification deleted successfully"
            });

        }
    );

};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================
module.exports = {
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    createNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
};