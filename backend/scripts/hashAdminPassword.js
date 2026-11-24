require("dotenv").config();
const db = require("../config/database");
const bcrypt = require("bcryptjs");

const username = "admin";
const newPassword = process.env.ADMIN_INITIAL_PASSWORD;

if (!newPassword) {
    console.error("ADMIN_INITIAL_PASSWORD is missing from .env");
    db.close();
    process.exit(1);
}
bcrypt.hash(newPassword, 10, (err, hashedPassword) => {

    if (err) {
        console.error("Password hashing error:", err.message);
        db.close();
        return;
    }

    const sql = `
        UPDATE users
        SET password = ?
        WHERE username = ?
    `;

    db.run(
        sql,
        [hashedPassword, username],
        function (err) {

            if (err) {

                console.error(
                    "Failed to update admin password:",
                    err.message
                );

                db.close();
                return;
            }

            if (this.changes === 0) {

                console.log("Admin user not found.");

            } else {

                console.log(
                    "Admin password hashed successfully."
                );

                console.log(
                    "Username: admin"
                );

                console.log(
                    "Password has been securely hashed."
                );

            }

            db.close();

        }
    );

});

