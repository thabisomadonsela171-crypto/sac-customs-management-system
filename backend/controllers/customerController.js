
const Customer = require("../models/customerModel");
const createAuditLog = require("../utils/auditLogger");


// =====================================================
// CREATE CUSTOMER
// =====================================================
const createCustomer = (req, res) => {

    console.log("🔥 NEW CUSTOMER CONTROLLER IS RUNNING");

    console.log("====================================");
    console.log("CREATE CUSTOMER CONTROLLER REACHED");
    console.log("REQ.USER:", req.user);
    console.log("====================================");

    const {
        customer_number,
        company_name,
        contact_person,
        email,
        phone,
        address
    } = req.body;

    if (!customer_number || !company_name) {
        return res.status(400).json({
            success: false,
            message: "Customer number and company name are required"
        });
    }

    const customer = {
        customer_number,
        company_name,
        contact_person: contact_person || null,
        email: email || null,
        phone: phone || null,
        address: address || null
    };

    Customer.create(customer, (err, newCustomer) => {

        if (err) {

            console.error(
                "Customer creation error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to create customer",
                error: err.message
            });

        }

        console.log("CUSTOMER CREATED:", newCustomer);

        // =================================================
        // AUTOMATIC AUDIT LOG
        // =================================================

        createAuditLog(
            req,
            "CREATE_CUSTOMER",
            "CUSTOMER",
            newCustomer.id,
            `Customer ${newCustomer.customer_number} created`
        );

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            customer: newCustomer
        });

    });

};


// =====================================================
// GET ALL CUSTOMERS
// =====================================================
const getCustomers = (req, res) => {

    Customer.getAll((err, customers) => {

        if (err) {

            console.error(
                "Customer retrieval error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve customers",
                error: err.message
            });

        }

        res.json({
            success: true,
            count: customers.length,
            customers
        });

    });

};


// =====================================================
// GET CUSTOMER BY ID
// =====================================================
const getCustomer = (req, res) => {

    const { id } = req.params;

    Customer.getById(id, (err, customer) => {

        if (err) {

            console.error(
                "Customer retrieval error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve customer",
                error: err.message
            });

        }

        if (!customer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });

        }

        res.json({
            success: true,
            customer
        });

    });

};


// =====================================================
// UPDATE CUSTOMER
// =====================================================
const updateCustomer = (req, res) => {

    const { id } = req.params;

    console.log("====================================");
    console.log("UPDATE CUSTOMER CONTROLLER REACHED");
    console.log("CUSTOMER ID:", id);
    console.log("REQ.BODY:", req.body);
    console.log("REQ.USER:", req.user);
    console.log("====================================");

    const {
        company_name,
        contact_person,
        email,
        phone,
        address
    } = req.body;


    if (!company_name || !company_name.trim()) {

        return res.status(400).json({
            success: false,
            message: "Company name is required"
        });

    }


    const customer = {

        company_name: company_name.trim(),

        contact_person:
            contact_person && contact_person.trim()
                ? contact_person.trim()
                : null,

        email:
            email && email.trim()
                ? email.trim()
                : null,

        phone:
            phone && phone.trim()
                ? phone.trim()
                : null,

        address:
            address && address.trim()
                ? address.trim()
                : null

    };


    Customer.update(id, customer, (err, updatedCustomer) => {

        if (err) {

            console.error(
                "Customer update error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to update customer",
                error: err.message
            });

        }


        if (!updatedCustomer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });

        }


        console.log(
            "CUSTOMER UPDATED:",
            updatedCustomer
        );


        // =================================================
        // AUTOMATIC AUDIT LOG
        // =================================================

        createAuditLog(
            req,
            "UPDATE_CUSTOMER",
            "CUSTOMER",
            updatedCustomer.id,
            `Customer ${updatedCustomer.customer_number} updated`
        );


        res.json({

            success: true,

            message: "Customer updated successfully",

            customer: updatedCustomer

        });

    });

};


// =====================================================
// DELETE CUSTOMER
// =====================================================
const deleteCustomer = (req, res) => {

    const { id } = req.params;

    console.log("====================================");
    console.log("DELETE CUSTOMER CONTROLLER REACHED");
    console.log("CUSTOMER ID:", id);
    console.log("REQ.USER:", req.user);
    console.log("====================================");


    // First get the customer
    // so we can create an audit log
    Customer.getById(id, (err, customer) => {

        if (err) {

            console.error(
                "Customer lookup error:",
                err.message
            );

            return res.status(500).json({
                success: false,
                message: "Failed to find customer",
                error: err.message
            });

        }


        if (!customer) {

            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });

        }


        // Now delete the customer
        Customer.delete(id, (deleteErr, result) => {

            if (deleteErr) {

                console.error(
                    "Customer deletion error:",
                    deleteErr.message
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to delete customer",
                    error: deleteErr.message
                });

            }


            console.log(
                "CUSTOMER DELETED:",
                customer
            );


            // =================================================
            // AUTOMATIC AUDIT LOG
            // =================================================

            createAuditLog(
                req,
                "DELETE_CUSTOMER",
                "CUSTOMER",
                customer.id,
                `Customer ${customer.customer_number} deleted`
            );


            res.json({

                success: true,

                message: "Customer deleted successfully",

                customer

            });

        });

    });

};


// =====================================================
// EXPORT CONTROLLERS
// =====================================================
module.exports = {

    createCustomer,

    getCustomers,

    getCustomer,

    updateCustomer,

    deleteCustomer

};

