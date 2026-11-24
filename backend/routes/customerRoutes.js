
const express = require("express");

const router = express.Router();

const {
    createCustomer,
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer
} = require("../controllers/customerController");


// =====================================================
// CREATE CUSTOMER
// =====================================================

router.post("/", createCustomer);


// =====================================================
// GET ALL CUSTOMERS
// =====================================================

router.get("/", getCustomers);


// =====================================================
// GET ONE CUSTOMER
// =====================================================

router.get("/:id", getCustomer);


// =====================================================
// UPDATE CUSTOMER
// =====================================================

router.put("/:id", updateCustomer);


// =====================================================
// DELETE CUSTOMER
// =====================================================

router.delete("/:id", deleteCustomer);


module.exports = router;

