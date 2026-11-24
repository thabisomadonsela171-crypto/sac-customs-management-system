const express = require("express");

const router = express.Router();

const {
    getNotifications,
    getUnreadNotifications,
    getUnreadCount,
    createNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} = require("../controllers/notificationController");


// =====================================================
// GET ALL NOTIFICATIONS
// GET /api/notifications
// =====================================================
router.get(
    "/",
    getNotifications
);


// =====================================================
// GET UNREAD NOTIFICATIONS
// GET /api/notifications/unread
// =====================================================
router.get(
    "/unread",
    getUnreadNotifications
);


// =====================================================
// GET UNREAD COUNT
// GET /api/notifications/unread/count
// =====================================================
router.get(
    "/unread/count",
    getUnreadCount
);


// =====================================================
// CREATE NOTIFICATION
// POST /api/notifications
// =====================================================
router.post(
    "/",
    createNotification
);


// =====================================================
// MARK ALL AS READ
// PUT /api/notifications/read-all
// =====================================================
router.put(
    "/read-all",
    markAllNotificationsAsRead
);


// =====================================================
// MARK ONE AS READ
// PUT /api/notifications/:id/read
// =====================================================
router.put(
    "/:id/read",
    markNotificationAsRead
);


// =====================================================
// DELETE NOTIFICATION
// DELETE /api/notifications/:id
// =====================================================
router.delete(
    "/:id",
    deleteNotification
);


module.exports = router;