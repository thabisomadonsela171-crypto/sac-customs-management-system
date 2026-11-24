const db = require("../config/database");

const Shipment = {

    // =====================================================
    // CREATE SHIPMENT
    // =====================================================

    create: (shipment, callback) => {

        const sql = `
            INSERT INTO shipments
            (
                shipment_number,
                customer_id,
                origin,
                destination,
                transport_mode,
                container_number,
                goods_description,
                expected_arrival,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            shipment.shipment_number,
            shipment.customer_id,
            shipment.origin,
            shipment.destination,
            shipment.transport_mode,
            shipment.container_number,
            shipment.goods_description,
            shipment.expected_arrival,
            shipment.status || "RECEIVED"
        ];

        db.run(sql, values, function (err) {

            if (err) {
                console.error(
                    "Shipment creation error:",
                    err.message
                );

                return callback(err);
            }

            const newShipment = {
                id: this.lastID,
                ...shipment,
                status: shipment.status || "RECEIVED"
            };

            callback(null, newShipment);
        });
    },


    // =====================================================
    // GET ALL SHIPMENTS
    // =====================================================

    getAll: (callback) => {

        const sql = `
            SELECT
                shipments.*,
                customers.customer_number,
                customers.company_name
            FROM shipments
            INNER JOIN customers
                ON shipments.customer_id = customers.id
            ORDER BY shipments.id DESC
        `;

        db.all(sql, [], (err, rows) => {

            if (err) {
                console.error(
                    "Get shipments error:",
                    err.message
                );

                return callback(err);
            }

            callback(null, rows);
        });
    },


    // =====================================================
    // GET SHIPMENT BY ID
    // =====================================================

    getById: (id, callback) => {

        const sql = `
            SELECT
                shipments.*,
                customers.customer_number,
                customers.company_name
            FROM shipments
            INNER JOIN customers
                ON shipments.customer_id = customers.id
            WHERE shipments.id = ?
        `;

        db.get(sql, [id], (err, row) => {

            if (err) {
                console.error(
                    "Get shipment by ID error:",
                    err.message
                );

                return callback(err);
            }

            callback(null, row);
        });
    },


    // =====================================================
    // UPDATE SHIPMENT STATUS
    // =====================================================

    updateStatus: (id, status, callback) => {

        const sql = `
            UPDATE shipments
            SET status = ?
            WHERE id = ?
        `;

        db.run(sql, [status, id], function (err) {

            if (err) {
                console.error(
                    "Shipment status update error:",
                    err.message
                );

                return callback(err);
            }

            // Shipment does not exist
            if (this.changes === 0) {
                return callback(null, null);
            }

            // Get the complete updated shipment
            Shipment.getById(
                id,
                (getErr, updatedShipment) => {

                    if (getErr) {
                        return callback(getErr);
                    }

                    callback(null, updatedShipment);
                }
            );
        });
    }

};


// =====================================================
// DEBUG INFORMATION
// =====================================================

console.log("Shipment model loaded");
console.log("create:", typeof Shipment.create);
console.log("getAll:", typeof Shipment.getAll);
console.log("getById:", typeof Shipment.getById);
console.log("updateStatus:", typeof Shipment.updateStatus);


module.exports = Shipment;