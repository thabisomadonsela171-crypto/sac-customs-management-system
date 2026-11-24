const db = require("../config/database");
const AuditLog = require("../models/auditLogModel");

// =====================================================
// CREATE DOCUMENT
// =====================================================
const createDocument = (req, res) => {

    const {
        document_number,
        shipment_id,
        document_type,
        file_name,
        file_path
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================
    if (
        !document_number ||
        !shipment_id ||
        !document_type
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Document number, shipment and document type are required"
        });
    }

    const sql = `
        INSERT INTO documents
        (
            document_number,
            shipment_id,
            document_type,
            file_name,
            file_path
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
        sql,
        [
            document_number,
            shipment_id,
            document_type,
            file_name || null,
            file_path || null
        ],
        function (err) {

            if (err) {

                console.error(
                    "Error creating document:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            const documentId = this.lastID;

            console.log(
                "DOCUMENT CREATED:",
                documentId
            );

            // =================================================
            // AUTOMATIC AUDIT LOG
            // =================================================
            AuditLog.create(
                {
                    user_id: req.user
                        ? req.user.id
                        : null,

                    action: "CREATED",

                    entity_type: "DOCUMENT",

                    entity_id: documentId,

                    description:
                        `Document ${document_number} was created`,

                    ip_address:
                        req.ip ||
                        req.headers["x-forwarded-for"] ||
                        req.connection?.remoteAddress ||
                        null
                },

                (auditErr) => {

                    if (auditErr) {

                        console.error(
                            "Document audit log error:",
                            auditErr.message
                        );

                    } else {

                        console.log(
                            `AUDIT: CREATED DOCUMENT #${documentId}`
                        );

                    }

                }
            );

            // =================================================
            // RESPONSE
            // =================================================
            return res.status(201).json({

                success: true,

                message:
                    "Document created successfully",

                document: {

                    id: documentId,

                    document_number,

                    shipment_id,

                    document_type,

                    file_name:
                        file_name || null,

                    file_path:
                        file_path || null,

                    status: "PENDING",

                    verified: 0
                }

            });

        }
    );
};


// =====================================================
// GET ALL DOCUMENTS
// =====================================================
const getDocuments = (req, res) => {

    const sql = `
        SELECT
            d.*,
            s.shipment_number
        FROM documents d
        JOIN shipments s
            ON d.shipment_id = s.id
        ORDER BY d.id DESC
    `;

    db.all(sql, [], (err, rows) => {

        if (err) {

            console.error(
                "Error fetching documents:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        return res.json({
            success: true,
            count: rows.length,
            documents: rows
        });

    });

};


// =====================================================
// GET DOCUMENT BY ID
// =====================================================
const getDocument = (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            d.*,
            s.shipment_number
        FROM documents d
        JOIN shipments s
            ON d.shipment_id = s.id
        WHERE d.id = ?
    `;

    db.get(sql, [id], (err, row) => {

        if (err) {

            console.error(
                "Error fetching document:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        if (!row) {

            return res.status(404).json({
                success: false,
                message: "Document not found"
            });
        }

        return res.json({
            success: true,
            document: row
        });

    });

};


// =====================================================
// VERIFY DOCUMENT
// =====================================================
const verifyDocument = (req, res) => {

    const { id } = req.params;

    // =================================================
    // FIRST FIND DOCUMENT
    // =================================================
    const getSql = `
        SELECT
            id,
            document_number,
            shipment_id,
            document_type
        FROM documents
        WHERE id = ?
    `;

    db.get(
        getSql,
        [id],
        (getErr, document) => {

            if (getErr) {

                console.error(
                    "Error finding document:",
                    getErr.message
                );

                return res.status(500).json({
                    success: false,
                    message: getErr.message
                });
            }

            if (!document) {

                return res.status(404).json({
                    success: false,
                    message: "Document not found"
                });
            }

            // =================================================
            // VERIFY DOCUMENT
            // =================================================
            const sql = `
                UPDATE documents
                SET
                    verified = 1,
                    status = 'VERIFIED'
                WHERE id = ?
            `;

            db.run(
                sql,
                [id],
                function (err) {

                    if (err) {

                        console.error(
                            "Error verifying document:",
                            err.message
                        );

                        return res.status(500).json({
                            success: false,
                            message: err.message
                        });
                    }

                    console.log(
                        "DOCUMENT VERIFIED:",
                        document.id
                    );

                    // =================================================
                    // AUTOMATIC AUDIT LOG
                    // =================================================
                    AuditLog.create(
                        {
                            user_id: req.user
                                ? req.user.id
                                : null,

                            action: "VERIFIED",

                            entity_type: "DOCUMENT",

                            entity_id: id,

                            description:
                                `Document ${document.document_number} was verified`,

                            ip_address:
                                req.ip ||
                                req.headers["x-forwarded-for"] ||
                                req.connection?.remoteAddress ||
                                null
                        },

                        (auditErr) => {

                            if (auditErr) {

                                console.error(
                                    "Document audit log error:",
                                    auditErr.message
                                );

                            } else {

                                console.log(
                                    `AUDIT: VERIFIED DOCUMENT #${id}`
                                );

                            }

                        }
                    );

                    // =================================================
                    // RESPONSE
                    // =================================================
                    return res.json({

                        success: true,

                        message:
                            "Document verified successfully"

                    });

                }
            );

        }
    );
};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================
module.exports = {
    createDocument,
    getDocuments,
    getDocument,
    verifyDocument
};