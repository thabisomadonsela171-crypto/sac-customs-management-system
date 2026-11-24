const db = require("../config/database");

// =====================================================
// SHIPMENT TRACKING MODEL
// =====================================================

const ShipmentTracking = {

    // =================================================
    // GET ALL SHIPMENT TRACKING INFORMATION
    // =================================================

    getAll: (callback) => {

        const sql = `
            SELECT
                s.id,
                s.shipment_number,
                s.customer_id,
                c.company_name AS customer_name,
                s.origin,
                s.destination,
                s.transport_mode,
                s.container_number,
                s.goods_description,
                s.expected_arrival,
                s.status,
                s.created_at
            FROM shipments s
            LEFT JOIN customers c
                ON s.customer_id = c.id
            ORDER BY s.id DESC
        `;

        db.all(
            sql,
            [],
            (err, tracking) => {

                if (err) {

                    console.error(
                        "Get all shipment tracking error:",
                        err.message
                    );

                    return callback(err);

                }

                callback(null, tracking);

            }
        );

    },

    // =================================================
    // GET SHIPMENT TRACKING BY SHIPMENT NUMBER
    // =================================================

    getByShipmentNumber: (shipmentNumber, callback) => {

        const sql = `
            SELECT
                s.id,
                s.shipment_number,
                s.customer_id,
                c.company_name AS customer_name,
                s.origin,
                s.destination,
                s.transport_mode,
                s.container_number,
                s.goods_description,
                s.expected_arrival,
                s.status,
                s.created_at
            FROM shipments s
            LEFT JOIN customers c
                ON s.customer_id = c.id
            WHERE s.shipment_number = ?
        `;

        db.get(
            sql,
            [shipmentNumber],
            (err, shipment) => {

                if (err) {

                    console.error(
                        "Shipment tracking error:",
                        err.message
                    );

                    return callback(err);

                }

                callback(null, shipment);

            }
        );

    }

};

module.exports = ShipmentTracking;