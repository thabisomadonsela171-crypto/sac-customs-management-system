
const db = require("../config/database");
const bcrypt = require("bcryptjs");

const User = {

    // =====================================================
    // CREATE USER
    // =====================================================
    create: (user, callback) => {

        // Hash password before saving
        bcrypt.hash(user.password, 10, (hashError, hashedPassword) => {

            if (hashError) {
                callback(hashError);
                return;
            }

            const sql = `
                INSERT INTO users
                (
                    user_number,
                    username,
                    password,
                    full_name,
                    email,
                    role,
                    status
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                user.user_number,
                user.username,
                hashedPassword,
                user.full_name,
                user.email,
                user.role || "CLERK",
                user.status || "ACTIVE"
            ];

            db.run(sql, values, function (err) {

                if (err) {
                    callback(err);
                    return;
                }

                // Never return the password
                const newUser = {
                    id: this.lastID,
                    user_number: user.user_number,
                    username: user.username,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role || "CLERK",
                    status: user.status || "ACTIVE"
                };

                callback(null, newUser);

            });

        });

    },


    // =====================================================
    // GET ALL USERS
    // =====================================================
    getAll: (callback) => {

        const sql = `
            SELECT
                id,
                user_number,
                username,
                full_name,
                email,
                role,
                status,
                created_at
            FROM users
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
    // GET USER BY ID
    // =====================================================
    getById: (id, callback) => {

        const sql = `
            SELECT
                id,
                user_number,
                username,
                full_name,
                email,
                role,
                status,
                created_at
            FROM users
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
    // GET USER BY USERNAME
    // Used for login
    // =====================================================
    getByUsername: (username, callback) => {

        const sql = `
            SELECT *
            FROM users
            WHERE username = ?
        `;

        db.get(sql, [username], (err, row) => {

            if (err) {
                callback(err);
            } else {
                callback(null, row);
            }

        });

    },


    // =====================================================
    // VERIFY PASSWORD
    // =====================================================
    verifyPassword: (password, hashedPassword, callback) => {

        bcrypt.compare(
            password,
            hashedPassword,
            (err, result) => {

                if (err) {
                    callback(err);
                    return;
                }

                callback(null, result);

            }
        );

    },


    // =====================================================
    // UPDATE USER STATUS
    // =====================================================
    updateStatus: (id, status, callback) => {

        const sql = `
            UPDATE users
            SET status = ?
            WHERE id = ?
        `;

        db.run(sql, [status, id], function (err) {

            if (err) {
                callback(err);
                return;
            }

            if (this.changes === 0) {
                callback(null, null);
                return;
            }

            User.getById(id, callback);

        });

    },


    // =====================================================
    // DELETE USER
    // =====================================================
    delete: (id, callback) => {

        const sql = `
            DELETE FROM users
            WHERE id = ?
        `;

        db.run(sql, [id], function (err) {

            if (err) {
                callback(err);
            } else {
                callback(null, this.changes);
            }

        });

    }

};

module.exports = User;

