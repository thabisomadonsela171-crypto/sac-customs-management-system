const express = require("express");

const router = express.Router();

const {
    createPayment,
    getPayments,
    getPayment,
    updatePaymentStatus
} = require("../controllers/paymentController");

router.post("/", createPayment);

router.get("/", getPayments);

router.patch("/:id/status", updatePaymentStatus);

router.get("/:id", getPayment);

module.exports = router;