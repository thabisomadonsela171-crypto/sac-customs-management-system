const Shipment = require("../models/shipmentModel");
const createAuditLog = require("../utils/auditLogger");
const Notification = require("../models/notificationModel");
const db = require("../config/database");

// =====================================================
// CREATE SHIPMENT
// =====================================================

const createShipment = (req, res) => {

    console.log("====================================");
    console.log("CREATE SHIPMENT CONTROLLER REACHED");
    console.log("REQ.USER:", req.user);
    console.log("====================================");

    const {
        shipment_number,
        customer_id,
        origin,
        destination,
        transport_mode,
        container_number,
        goods_description,
        expected_arrival,
        status
    } = req.body;

    if (
        !shipment_number ||
        !customer_id ||
        !origin ||
        !destination ||
        !transport_mode
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Shipment number, customer, origin, destination and transport mode are required"
        });
    }

    const shipment = {
        shipment_number,
        customer_id,
        origin,
        destination,
        transport_mode,
        container_number: container_number || null,
        goods_description: goods_description || null,
        expected_arrival: expected_arrival || null,
        status: status || "RECEIVED"
    };

    Shipment.create(
        shipment,
        (err, newShipment) => {

            if (err) {
                console.error(
                    "Shipment creation error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to create shipment",
                    error: err.message
                });
            }

            createAuditLog(
                req,
                "CREATE_SHIPMENT",
                "SHIPMENT",
                newShipment.id,
                `Shipment ${newShipment.shipment_number} created`
            );

            const customsOfficerSql = `
                SELECT id
                FROM users
                WHERE role = 'CUSTOMS_OFFICER'
            `;

            db.all(
                customsOfficerSql,
                [],
                (userErr, customsOfficers) => {

                    if (userErr) {
                        console.error(
                            "Failed to find Customs Officers:",
                            userErr.message
                        );
                        return;
                    }

                    customsOfficers.forEach((officer) => {

                        Notification.create(
                            officer.id,
                            "New Shipment Created",
                            `Shipment ${newShipment.shipment_number} has been created and is ready for customs processing.`,
                            "SHIPMENT",
                            "SHIPMENT",
                            newShipment.id,
                            (notificationErr) => {

                                if (notificationErr) {
                                    console.error(
                                        "Shipment notification error:",
                                        notificationErr.message
                                    );
                                }

                            }
                        );

                    });

                }
            );

            return res.status(201).json({
                success: true,
                message: "Shipment created successfully",
                shipment: newShipment
            });

        }
    );
};


// =====================================================
// GET ALL SHIPMENTS
// =====================================================

const getShipments = (req, res) => {

    Shipment.getAll(
        (err, shipments) => {

            if (err) {

                console.error(
                    "Shipment retrieval error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to retrieve shipments",
                    error: err.message
                });

            }

            return res.json({
                success: true,
                count: shipments.length,
                shipments
            });

        }
    );

};


// =====================================================
// GET SHIPMENT BY ID
// =====================================================

const getShipment = (req, res) => {

    const { id } = req.params;

    Shipment.getById(
        id,
        (err, shipment) => {

            if (err) {

                console.error(
                    "Shipment retrieval error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to retrieve shipment",
                    error: err.message
                });

            }

            if (!shipment) {

                return res.status(404).json({
                    success: false,
                    message: "Shipment not found"
                });

            }

            return res.json({
                success: true,
                shipment
            });

        }
    );

};


// =====================================================
// UPDATE SHIPMENT STATUS
// =====================================================

const updateShipmentStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    console.log("====================================");
    console.log("UPDATE SHIPMENT STATUS");
    console.log("SHIPMENT ID:", id);
    console.log("NEW STATUS:", status);
    console.log("REQ.USER:", req.user);
    console.log("====================================");

    // =====================================================
    // STATUS WORKFLOW
    // =====================================================

    const allowedStatuses = [
        "RECEIVED",
        "PROCESSING",
        "DOCUMENTS_VERIFIED",
        "CUSTOMS_CLEARED",
        "IN_TRANSIT",
        "ARRIVED",
        "DELIVERED",
        "ON_HOLD",
        "CANCELLED"
    ];

    // =====================================================
    // VALIDATE STATUS
    // =====================================================

    if (!status) {

        return res.status(400).json({
            success: false,
            message: "Shipment status is required"
        });

    }

    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid shipment status",
            allowed_statuses: allowedStatuses
        });

    }

    // =====================================================
    // GET EXISTING SHIPMENT
    // =====================================================

    Shipment.getById(
        id,
        (getErr, existingShipment) => {

            if (getErr) {

                console.error(
                    "Shipment lookup error:",
                    getErr.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to retrieve shipment",
                    error: getErr.message
                });

            }

            if (!existingShipment) {

                return res.status(404).json({
                    success: false,
                    message: "Shipment not found"
                });

            }

            const shipmentNumber =
                existingShipment.shipment_number;

            // =================================================
            // UPDATE DATABASE
            // =================================================

            Shipment.updateStatus(
                id,
                status,
                (updateErr, updatedShipment) => {

                    if (updateErr) {

                        console.error(
                            "Shipment status update error:",
                            updateErr.message
                        );

                        return res.status(500).json({
                            success: false,
                            message:
                                "Failed to update shipment status",
                            error:
                                updateErr.message
                        });

                    }

                    if (!updatedShipment) {

                        return res.status(404).json({
                            success: false,
                            message: "Shipment not found"
                        });

                    }

                    console.log(
                        `SHIPMENT ${shipmentNumber} STATUS SAVED AS ${status}`
                    );

                    // =================================================
                    // AUDIT LOG
                    // =================================================

                    createAuditLog(
                        req,
                        "UPDATE_SHIPMENT_STATUS",
                        "SHIPMENT",
                        id,
                        `Shipment ${shipmentNumber} status changed to ${status}`
                    );

                    // =================================================
                    // GET FINAL DATABASE RECORD
                    // =================================================

                    Shipment.getById(
                        id,
                        (finalErr, finalShipment) => {

                            if (finalErr) {

                                console.error(
                                    "Final shipment lookup error:",
                                    finalErr.message
                                );

                                return res.status(500).json({
                                    success: false,
                                    message:
                                        "Shipment updated but failed to retrieve final shipment",
                                    error:
                                        finalErr.message
                                });

                            }

                            return res.json({
                                success: true,
                                message:
                                    "Shipment status updated successfully",
                                shipment:
                                    finalShipment ||
                                    updatedShipment
                            });

                        }
                    );

                }
            );

        }
    );

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
    createShipment,
    getShipments,
    getShipment,
    updateShipmentStatus
};