
const express = require("express");

const router = express.Router();

const {
    createShipment,
    getShipments,
    getShipment,
    updateShipmentStatus
} = require("../controllers/shipmentController");


// =====================================================
// CREATE SHIPMENT
// POST /api/shipments
// =====================================================

router.post("/", createShipment);


// =====================================================
// GET ALL SHIPMENTS
// GET /api/shipments
// =====================================================

router.get("/", getShipments);


// =====================================================
// UPDATE SHIPMENT STATUS
// PATCH /api/shipments/:id/status
// =====================================================

router.patch("/:id/status", updateShipmentStatus);


// =====================================================
// GET SHIPMENT BY ID
// GET /api/shipments/:id
// =====================================================

router.get("/:id", getShipment);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;

