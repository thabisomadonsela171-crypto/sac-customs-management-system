
const db = require("../config/database");

const Customer = {

    // =====================================================
    // CREATE CUSTOMER
    // =====================================================
    create: (customer, callback) => {

        const sql = `
            INSERT INTO customers
            (customer_number, company_name, contact_person, email, phone, address)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const values = [
            customer.customer_number,
            customer.company_name,
            customer.contact_person,
            customer.email,
            customer.phone,
            customer.address
        ];

        db.run(sql, values, function (err) {

            if (err) {
                callback(err);
            } else {

                callback(null, {
                    id: this.lastID,
                    ...customer
                });

            }

        });

    },


    // =====================================================
    // GET ALL CUSTOMERS
    // =====================================================
    getAll: (callback) => {

        const sql = `
            SELECT *
            FROM customers
            ORDER BY id DESC
        `;

        db.all(sql, [], (err, rows) => {

            if (err) {
                callback(err);
            } else {
                callback(null, rows);
            }

        });

    },


    // =====================================================
    // GET CUSTOMER BY ID
    // =====================================================
    getById: (id, callback) => {

        const sql = `
            SELECT *
            FROM customers
            WHERE id = ?
        `;

        db.get(sql, [id], (err, row) => {

            if (err) {
                callback(err);
            } else {
                callback(null, row);
            }

        });

    },


    // =====================================================
    // UPDATE CUSTOMER
    // =====================================================
    update: (id, customer, callback) => {

        const sql = `
            UPDATE customers
            SET
                company_name = ?,
                contact_person = ?,
                email = ?,
                phone = ?,
                address = ?
            WHERE id = ?
        `;

        const values = [
            customer.company_name,
            customer.contact_person,
            customer.email,
            customer.phone,
            customer.address,
            id
        ];

        db.run(sql, values, function (err) {

            if (err) {

                callback(err);

            } else {

                if (this.changes === 0) {

                    callback(null, null);

                    return;

                }

                // Return the updated customer
                Customer.getById(id, callback);

            }

        });

    },


    // =====================================================
    // DELETE CUSTOMER
    // =====================================================
    delete: (id, callback) => {

        const sql = `
            DELETE FROM customers
            WHERE id = ?
        `;

        db.run(sql, [id], function (err) {

            if (err) {

                callback(err);

            } else {

                callback(null, {
                    deleted: this.changes > 0,
                    changes: this.changes
                });

            }

        });

    }

};

module.exports = Customer;

