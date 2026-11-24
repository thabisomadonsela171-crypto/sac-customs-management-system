const db = require("../config/database");

const Declaration = {

    // Create declaration
    create: (declaration, callback) => {

        const sql = `
            INSERT INTO declarations (
                declaration_number,
                shipment_id,
                hs_code,
                goods_description,
                customs_value,
                currency,
                country_of_origin,
                quantity,
                weight,
                duty_amount,
                vat_amount,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            declaration.declaration_number,
            declaration.shipment_id,
            declaration.hs_code,
            declaration.goods_description,
            declaration.customs_value,
            declaration.currency,
            declaration.country_of_origin,
            declaration.quantity || null,
            declaration.weight || null,
            declaration.duty_amount || 0,
            declaration.vat_amount || 0,
            declaration.status || "DRAFT"
        ];

        db.run(sql, values, function (err) {

            if (err) {
                console.error(
                    "Declaration creation error:",
                    err.message
                );

                return callback(err);
            }

            callback(null, {
                id: this.lastID,
                ...declaration,
                status: declaration.status || "DRAFT"
            });
        });
    },


    // Get all declarations
    getAll: (callback) => {

        const sql = `
            SELECT
                declarations.*,
                shipments.shipment_number,
                customers.customer_number,
                customers.company_name
            FROM declarations
            INNER JOIN shipments
                ON declarations.shipment_id = shipments.id
            INNER JOIN customers
                ON shipments.customer_id = customers.id
            ORDER BY declarations.id DESC
        `;

        db.all(sql, [], (err, rows) => {

            if (err) {
                console.error(
                    "Get declarations error:",
                    err.message
                );

                return callback(err);
            }

            callback(null, rows || []);
        });
    },


    // Get declaration by ID
    getById: (id, callback) => {

        const sql = `
            SELECT
                declarations.*,
                shipments.shipment_number,
                customers.customer_number,
                customers.company_name
            FROM declarations
            INNER JOIN shipments
                ON declarations.shipment_id = shipments.id
            INNER JOIN customers
                ON shipments.customer_id = customers.id
            WHERE declarations.id = ?
        `;

        db.get(sql, [id], (err, row) => {

            if (err) {
                console.error(
                    "Get declaration by ID error:",
                    err.message
                );

                return callback(err);
            }

            callback(null, row);
        });
    },


    // Update declaration status
    updateStatus: (id, status, callback) => {

        const sql = `
            UPDATE declarations
            SET status = ?,
                submitted_at = CASE
                    WHEN ? = 'SUBMITTED'
                    THEN CURRENT_TIMESTAMP
                    ELSE submitted_at
                END
            WHERE id = ?
        `;

        db.run(
            sql,
            [status, status, id],
            function (err) {

                if (err) {
                    console.error(
                        "Declaration status update error:",
                        err.message
                    );

                    return callback(err);
                }

                if (this.changes === 0) {
                    return callback(null, null);
                }

                // Get the complete updated declaration
                // so the controller has declaration_number
                Declaration.getById(
                    id,
                    (getErr, updatedDeclaration) => {

                        if (getErr) {
                            return callback(getErr);
                        }

                        callback(
                            null,
                            updatedDeclaration
                        );
                    }
                );
            }
        );
    }

};


// Debug information
console.log("====================================");
console.log("DECLARATION MODEL LOADED");
console.log("DECLARATION MODEL FILE:", __filename);
console.log(
    "create:",
    typeof Declaration.create
);
console.log(
    "getAll:",
    typeof Declaration.getAll
);
console.log(
    "getById:",
    typeof Declaration.getById
);
console.log(
    "updateStatus:",
    typeof Declaration.updateStatus
);
console.log("====================================");


module.exports = Declaration;