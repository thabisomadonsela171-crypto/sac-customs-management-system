const db = require("../config/database");

const Payment = {

    create: (payment, callback) => {
        const sql = `
            INSERT INTO payments
            (
                payment_number,
                declaration_id,
                customer_id,
                amount,
                currency,
                payment_method,
                payment_reference,
                status,
                payment_date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            payment.payment_number,
            payment.declaration_id,
            payment.customer_id,
            payment.amount,
            payment.currency,
            payment.payment_method,
            payment.payment_reference || null,
            payment.status || "PENDING",
            payment.payment_date || null
        ];

        db.run(sql, values, function (err) {
            if (err) {
                callback(err);
            } else {
                callback(null, {
                    id: this.lastID,
                    ...payment,
                    status: payment.status || "PENDING"
                });
            }
        });
    },

    getAll: (callback) => {
        const sql = `
            SELECT
                payments.*,
                declarations.declaration_number,
                customers.customer_number,
                customers.company_name
            FROM payments
            INNER JOIN declarations
                ON payments.declaration_id = declarations.id
            INNER JOIN customers
                ON payments.customer_id = customers.id
            ORDER BY payments.id DESC
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                callback(err);
            } else {
                callback(null, rows);
            }
        });
    },

    getById: (id, callback) => {
        const sql = `
            SELECT
                payments.*,
                declarations.declaration_number,
                customers.customer_number,
                customers.company_name
            FROM payments
            INNER JOIN declarations
                ON payments.declaration_id = declarations.id
            INNER JOIN customers
                ON payments.customer_id = customers.id
            WHERE payments.id = ?
        `;

        db.get(sql, [id], (err, row) => {
            if (err) {
                callback(err);
            } else {
                callback(null, row);
            }
        });
    },

    updateStatus: (id, status, callback) => {
        const sql = `
            UPDATE payments
            SET status = ?,
                payment_date = CASE
                    WHEN ? = 'PAID' THEN CURRENT_TIMESTAMP
                    ELSE payment_date
                END
            WHERE id = ?
        `;

        db.run(sql, [status, status, id], function (err) {
            if (err) {
                callback(err);
                return;
            }

            if (this.changes === 0) {
                callback(null, null);
                return;
            }

            Payment.getById(id, callback);
        });
    }

};

module.exports = Payment;