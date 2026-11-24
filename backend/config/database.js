const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const databasePath = path.join(
    __dirname,
    "..",
    "database",
    "sac_customs.sqlite"
);

const db = new sqlite3.Database(databasePath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to SAC Customs database");

        db.run("PRAGMA foreign_keys = ON", (pragmaErr) => {
            if (pragmaErr) {
                console.error(
                    "Failed to enable foreign keys:",
                    pragmaErr.message
                );
            } else {
                console.log("SQLite foreign-key enforcement enabled");
            }
        });
    }
});

module.exports = db;