const Payment = require("../models/paymentModel");
const AuditLog = require("../models/auditLogModel");

// =====================================================
// CREATE PAYMENT
// =====================================================
const createPayment = (req, res) => {

    const {
        payment_number,
        declaration_id,
        customer_id,
        amount,
        currency,
        payment_method,
        payment_reference,
        status,
        payment_date
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================
    if (
        !payment_number ||
        !declaration_id ||
        !customer_id ||
        amount === undefined ||
        !currency ||
        !payment_method
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Payment number, declaration, customer, amount, currency and payment method are required"
        });
    }

    const payment = {
        payment_number,
        declaration_id,
        customer_id,
        amount,
        currency,
        payment_method,
        payment_reference: payment_reference || null,
        status: status || "PENDING",
        payment_date: payment_date || null
    };

    // =================================================
    // CREATE PAYMENT
    // =================================================
    Payment.create(payment, (err, newPayment) => {

        if (err) {

            console.error(
                "Payment creation error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to create payment",
                error: err.message
            });
        }

        console.log(
            "PAYMENT CREATED:",
            newPayment
        );

        // =================================================
        // AUTOMATIC AUDIT LOG
        // =================================================
        AuditLog.create(
            {
                user_id: req.user ? req.user.id : null,
                action: "CREATED",
                entity_type: "PAYMENT",
                entity_id: newPayment.id,
                description:
                    `Payment ${newPayment.payment_number} was created`,
                ip_address:
                    req.ip ||
                    req.headers["x-forwarded-for"] ||
                    req.connection?.remoteAddress ||
                    null
            },
            (auditErr) => {

                if (auditErr) {

                    console.error(
                        "Payment audit log error:",
                        auditErr.message
                    );

                } else {

                    console.log(
                        `AUDIT: CREATED PAYMENT #${newPayment.id}`
                    );

                }

            }
        );

        // =================================================
        // RESPONSE
        // =================================================
        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            payment: newPayment
        });

    });

};


// =====================================================
// GET ALL PAYMENTS
// =====================================================
const getPayments = (req, res) => {

    Payment.getAll((err, payments) => {

        if (err) {

            console.error(
                "Payment retrieval error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve payments",
                error: err.message
            });

        }

        return res.json({
            success: true,
            count: payments.length,
            payments
        });

    });

};


// =====================================================
// GET PAYMENT BY ID
// =====================================================
const getPayment = (req, res) => {

    const { id } = req.params;

    Payment.getById(id, (err, payment) => {

        if (err) {

            console.error(
                "Payment retrieval error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve payment",
                error: err.message
            });

        }

        if (!payment) {

            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });

        }

        return res.json({
            success: true,
            payment
        });

    });

};


// =====================================================
// UPDATE PAYMENT STATUS
// =====================================================
const updatePaymentStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
        "PENDING",
        "PROCESSING",
        "PAID",
        "FAILED",
        "CANCELLED"
    ];

    // =================================================
    // VALIDATE STATUS
    // =================================================
    if (!status) {

        return res.status(400).json({
            success: false,
            message: "Payment status is required"
        });

    }

    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid payment status",
            allowed_statuses: allowedStatuses
        });

    }

    // =================================================
    // UPDATE PAYMENT
    // =================================================
    Payment.updateStatus(
        id,
        status,
        (err, updatedPayment) => {

            if (err) {

                console.error(
                    "Payment status update error:",
                    err.message
                );

                return res.status(500).json({
                    success: false,
                    message:
                        "Failed to update payment status",
                    error: err.message
                });

            }

            if (!updatedPayment) {

                return res.status(404).json({
                    success: false,
                    message: "Payment not found"
                });

            }

            console.log(
                "PAYMENT STATUS UPDATED:",
                updatedPayment
            );

            // =================================================
            // AUTOMATIC AUDIT LOG
            // =================================================
            AuditLog.create(
                {
                    user_id: req.user ? req.user.id : null,
                    action: status,
                    entity_type: "PAYMENT",
                    entity_id: updatedPayment.id,
                    description:
                        `Payment ${updatedPayment.payment_number} status changed to ${status}`,
                    ip_address:
                        req.ip ||
                        req.headers["x-forwarded-for"] ||
                        req.connection?.remoteAddress ||
                        null
                },
                (auditErr) => {

                    if (auditErr) {

                        console.error(
                            "Payment audit log error:",
                            auditErr.message
                        );

                    } else {

                        console.log(
                            `AUDIT: ${status} PAYMENT #${updatedPayment.id}`
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
                    "Payment status updated successfully",
                payment: updatedPayment
            });

        }
    );

};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================
module.exports = {
    createPayment,
    getPayments,
    getPayment,
    updatePaymentStatus
};