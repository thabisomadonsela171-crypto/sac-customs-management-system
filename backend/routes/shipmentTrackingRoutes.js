const express = require("express");

const router = express.Router();

const {
    getAllShipmentTracking,
    getShipmentTracking
} = require("../controllers/shipmentTrackingController");

// =====================================================
// GET ALL TRACKING RECORDS
// GET /api/tracking
// =====================================================

router.get("/", getAllShipmentTracking);

// =====================================================
// GET TRACKING BY SHIPMENT NUMBER
// GET /api/tracking/:shipmentNumber
// =====================================================

router.get("/:shipmentNumber", getShipmentTracking);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;