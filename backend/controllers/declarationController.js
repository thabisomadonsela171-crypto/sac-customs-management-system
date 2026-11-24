const Declaration = require("../models/declarationModel");
const AuditLog = require("../models/auditLogModel");

// =====================================================
// CREATE DECLARATION
// =====================================================
const createDeclaration = (req, res) => {

    const {
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
    } = req.body;

    if (
        !declaration_number ||
        !shipment_id ||
        !hs_code ||
        !goods_description ||
        customs_value === undefined ||
        !currency ||
        !country_of_origin
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Declaration number, shipment, HS code, goods description, customs value, currency and country of origin are required"
        });
    }

    const declaration = {
        declaration_number,
        shipment_id,
        hs_code,
        goods_description,
        customs_value,
        currency,
        country_of_origin,
        quantity: quantity || null,
        weight: weight || null,
        duty_amount: duty_amount || 0,
        vat_amount: vat_amount || 0,
        status: status || "DRAFT"
    };

    Declaration.create(declaration, (err, newDeclaration) => {

        if (err) {
            console.error(
                "Declaration creation error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to create declaration",
                error: err.message
            });
        }

        // =================================================
        // AUTOMATIC AUDIT LOG
        // =================================================
        AuditLog.create(
            {
                user_id: req.user ? req.user.id : null,
                action: "CREATED",
                entity_type: "DECLARATION",
                entity_id: newDeclaration.id,
                description:
                    `Declaration ${newDeclaration.declaration_number} was created`,
                ip_address:
                    req.ip ||
                    req.headers["x-forwarded-for"] ||
                    req.connection?.remoteAddress ||
                    null
            },
            (auditErr) => {

                if (auditErr) {
                    console.error(
                        "Declaration audit log error:",
                        auditErr.message
                    );
                }

            }
        );

        res.status(201).json({
            success: true,
            message: "Declaration created successfully",
            declaration: newDeclaration
        });
    });
};


// =====================================================
// GET ALL DECLARATIONS
// =====================================================
const getDeclarations = (req, res) => {

    Declaration.getAll((err, declarations) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve declarations",
                error: err.message
            });
        }

        res.json({
            success: true,
            count: declarations.length,
            declarations
        });
    });
};


// =====================================================
// GET DECLARATION BY ID
// =====================================================
const getDeclaration = (req, res) => {

    const { id } = req.params;

    Declaration.getById(id, (err, declaration) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to retrieve declaration",
                error: err.message
            });
        }

        if (!declaration) {
            return res.status(404).json({
                success: false,
                message: "Declaration not found"
            });
        }

        res.json({
            success: true,
            declaration
        });
    });
};


// =====================================================
// UPDATE DECLARATION STATUS
// =====================================================
const updateDeclarationStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "DRAFT",
        "SUBMITTED",
        "PROCESSING",
        "APPROVED",
        "REJECTED",
        "CLEARED"
    ];

    if (!status) {
        return res.status(400).json({
            success: false,
            message: "Declaration status is required"
        });
    }

    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid declaration status",
            allowed_statuses: allowedStatuses
        });
    }

    Declaration.updateStatus(
        id,
        status,
        (err, updatedDeclaration) => {

            if (err) {
                console.error(
                    "Declaration status update error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to update declaration status",
                    error: err.message
                });
            }

            if (!updatedDeclaration) {
                return res.status(404).json({
                    success: false,
                    message: "Declaration not found"
                });
            }

            // =================================================
            // AUTOMATIC AUDIT LOG
            // =================================================
            AuditLog.create(
                {
                    user_id: req.user ? req.user.id : null,
                    action: status,
                    entity_type: "DECLARATION",
                    entity_id: id,
                    description:
                        `Declaration ${updatedDeclaration.declaration_number} status changed to ${status}`,
                    ip_address:
                        req.ip ||
                        req.headers["x-forwarded-for"] ||
                        req.connection?.remoteAddress ||
                        null
                },
                (auditErr) => {

                    if (auditErr) {
                        console.error(
                            "Declaration audit log error:",
                            auditErr.message
                        );
                    }

                }
            );

            res.json({
                success: true,
                message:
                    "Declaration status updated successfully",
                declaration: updatedDeclaration
            });
        }
    );
};


module.exports = {
    createDeclaration,
    getDeclarations,
    getDeclaration,
    updateDeclarationStatus
};