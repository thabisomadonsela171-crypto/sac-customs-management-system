const db = require("../config/database");

db.serialize(() => {

    // =====================================================
    // USERS TABLE
    // =====================================================
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_number TEXT UNIQUE NOT NULL,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            role TEXT NOT NULL DEFAULT 'CLERK',
            status TEXT NOT NULL DEFAULT 'ACTIVE',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error(
                "Error creating users table:",
                err.message
            );
        } else {
            console.log(
                "Users table created successfully"
            );
        }
    });


    // =====================================================
    // CUSTOMERS TABLE
    // =====================================================
    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_number TEXT UNIQUE NOT NULL,
            company_name TEXT NOT NULL,
            contact_person TEXT,
            email TEXT,
            phone TEXT,
            address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error(
                "Error creating customers table:",
                err.message
            );
        } else {
            console.log(
                "Customers table created successfully"
            );
        }
    });


    // =====================================================
    // SHIPMENTS TABLE
    // =====================================================
    db.run(`
        CREATE TABLE IF NOT EXISTS shipments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shipment_number TEXT UNIQUE NOT NULL,
            customer_id INTEGER NOT NULL,
            origin TEXT NOT NULL,
            destination TEXT NOT NULL,
            transport_mode TEXT NOT NULL,
            container_number TEXT,
            goods_description TEXT,
            expected_arrival DATE,
            status TEXT DEFAULT 'RECEIVED',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (customer_id)
                REFERENCES customers(id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error(
                "Error creating shipments table:",
                err.message
            );
        } else {
            console.log(
                "Shipments table created successfully"
            );
        }
    });


    // =====================================================
    // DOCUMENTS TABLE
    // =====================================================
    db.run(`
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_number TEXT UNIQUE NOT NULL,
            shipment_id INTEGER NOT NULL,
            document_type TEXT NOT NULL,
            file_name TEXT,
            file_path TEXT,
            status TEXT DEFAULT 'PENDING',
            verified INTEGER DEFAULT 0,
            uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (shipment_id)
                REFERENCES shipments(id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error(
                "Error creating documents table:",
                err.message
            );
        } else {
            console.log(
                "Documents table created successfully"
            );
        }
    });


    // =====================================================
    // DECLARATIONS TABLE
    // =====================================================
    db.run(`
        CREATE TABLE IF NOT EXISTS declarations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            declaration_number TEXT UNIQUE NOT NULL,
            shipment_id INTEGER NOT NULL,
            hs_code TEXT NOT NULL,
            goods_description TEXT NOT NULL,
            customs_value REAL NOT NULL,
            currency TEXT NOT NULL,
            country_of_origin TEXT NOT NULL,
            quantity REAL,
            weight REAL,
            duty_amount REAL DEFAULT 0,
            vat_amount REAL DEFAULT 0,
            status TEXT DEFAULT 'DRAFT',
            submitted_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (shipment_id)
                REFERENCES shipments(id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error(
                "Error creating declarations table:",
                err.message
            );
        } else {
            console.log(
                "Declarations table created successfully"
            );
        }
    });


    // =====================================================
    // PAYMENTS TABLE
    // =====================================================
    db.run(`
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            payment_number TEXT UNIQUE NOT NULL,
            declaration_id INTEGER NOT NULL,
            customer_id INTEGER NOT NULL,
            amount REAL NOT NULL,
            currency TEXT NOT NULL,
            payment_method TEXT NOT NULL,
            payment_reference TEXT,
            status TEXT DEFAULT 'PENDING',
            payment_date DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (declaration_id)
                REFERENCES declarations(id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE,

            FOREIGN KEY (customer_id)
                REFERENCES customers(id)
                ON DELETE RESTRICT
                ON UPDATE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error(
                "Error creating payments table:",
                err.message
            );
        } else {
            console.log(
                "Payments table created successfully"
            );
        }
    });


    // =====================================================
    // AUDIT LOGS TABLE
    // =====================================================
    db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action TEXT NOT NULL,
            entity_type TEXT NOT NULL,
            entity_id INTEGER,
            description TEXT,
            ip_address TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE SET NULL
                ON UPDATE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error(
                "Error creating audit_logs table:",
                err.message
            );
        } else {
            console.log(
                "Audit logs table created successfully"
            );
        }
    });


    // =====================================================
    // NOTIFICATIONS TABLE
    // =====================================================
    db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            notification_type TEXT NOT NULL DEFAULT 'INFO',
            entity_type TEXT,
            entity_id INTEGER,
            is_read INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
    `, (err) => {
        if (err) {
            console.error(
                "Error creating notifications table:",
                err.message
            );
        } else {
            console.log(
                "Notifications table created successfully"
            );
        }
    });

});


// =====================================================
// CLOSE DATABASE
// =====================================================
db.close((err) => {

    if (err) {

        console.error(
            "Error closing database:",
            err.message
        );

    } else {

        console.log(
            "Database initialization completed"
        );

    }

});