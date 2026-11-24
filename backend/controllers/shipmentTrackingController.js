const ShipmentTracking = require("../models/shipmentTrackingModel");

// =====================================================
// GET ALL SHIPMENT TRACKING
// =====================================================

const getAllShipmentTracking = (req, res) => {

    console.log("ALL SHIPMENT TRACKING REQUEST");

    ShipmentTracking.getAll((err, tracking) => {

        if (err) {

            console.error(
                "Get all shipment tracking error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve tracking records",
                error: err.message
            });

        }

        return res.status(200).json({

            success: true,

            message:
                "Shipment tracking records retrieved successfully",

            tracking: tracking || []

        });

    });

};

// =====================================================
// GET SHIPMENT TRACKING BY SHIPMENT NUMBER
// =====================================================

const getShipmentTracking = (req, res) => {

    const shipmentNumber = req.params.shipmentNumber;

    console.log(
        "SHIPMENT TRACKING REQUEST:",
        shipmentNumber
    );

    if (!shipmentNumber) {

        return res.status(400).json({
            success: false,
            message: "Shipment number is required"
        });

    }

    ShipmentTracking.getByShipmentNumber(
        shipmentNumber,
        (err, shipment) => {

            if (err) {

                console.error(
                    "Shipment tracking controller error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to retrieve shipment tracking information",
                    error: err.message
                });

            }

            if (!shipment) {

                return res.status(404).json({
                    success: false,
                    message:
                        `Shipment not found: ${shipmentNumber}`
                });

            }

            return res.status(200).json({

                success: true,

                message:
                    "Shipment tracking information retrieved successfully",

                tracking: shipment

            });

        }
    );

};

// =====================================================
// EXPORT CONTROLLER
// =====================================================

module.exports = {
    getAllShipmentTracking,
    getShipmentTracking
};