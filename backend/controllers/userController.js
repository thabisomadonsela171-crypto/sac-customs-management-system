
const User = require("../models/userModel");


// =====================================================
// CREATE USER
// =====================================================
const createUser = (req, res) => {

    const {
        user_number,
        username,
        password,
        full_name,
        email,
        role,
        status
    } = req.body;


    // Validate required fields
    if (
        !user_number ||
        !username ||
        !password ||
        !full_name ||
        !email
    ) {
        return res.status(400).json({
            success: false,
            message:
                "User number, username, password, full name and email are required"
        });
    }


    const allowedRoles = [
        "ADMIN",
        "CLERK",
        "FINANCE",
        "CUSTOMS_OFFICER",
        "CLIENT"
    ];


    const selectedRole = role || "CLERK";


    if (!allowedRoles.includes(selectedRole)) {

        return res.status(400).json({
            success: false,
            message: "Invalid user role",
            allowed_roles: allowedRoles
        });

    }


    const user = {
        user_number,
        username,
        password,
        full_name,
        email,
        role: selectedRole,
        status: status || "ACTIVE"
    };


    User.create(user, (err, newUser) => {

        if (err) {

            console.error(
                "User creation error:",
                err.message
            );


            return res.status(500).json({
                success: false,
                message: "Failed to create user",
                error: err.message
            });

        }


        // Never return the password
        delete newUser.password;


        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: newUser
        });

    });

};



// =====================================================
// GET ALL USERS
// =====================================================
const getUsers = (req, res) => {

    User.getAll((err, users) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve users",
                error: err.message
            });

        }


        res.json({
            success: true,
            count: users.length,
            users
        });

    });

};



// =====================================================
// GET USER BY ID
// =====================================================
const getUser = (req, res) => {

    const { id } = req.params;


    User.getById(id, (err, user) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to retrieve user",
                error: err.message
            });

        }


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        res.json({
            success: true,
            user
        });

    });

};



// =====================================================
// UPDATE USER STATUS
// =====================================================
const updateUserStatus = (req, res) => {

    const { id } = req.params;
    const { status } = req.body;


    const allowedStatuses = [
        "ACTIVE",
        "INACTIVE",
        "SUSPENDED"
    ];


    if (!status) {

        return res.status(400).json({
            success: false,
            message: "User status is required"
        });

    }


    if (!allowedStatuses.includes(status)) {

        return res.status(400).json({
            success: false,
            message: "Invalid user status",
            allowed_statuses: allowedStatuses
        });

    }


    User.updateStatus(
        id,
        status,
        (err, updatedUser) => {

            if (err) {

                console.error(
                    "User status update error:",
                    err.message
                );


                return res.status(500).json({
                    success: false,
                    message: "Failed to update user status",
                    error: err.message
                });

            }


            if (!updatedUser) {

                return res.status(404).json({
                    success: false,
                    message: "User not found"
                });

            }


            res.json({
                success: true,
                message: "User status updated successfully",
                user: updatedUser
            });

        }
    );

};



// =====================================================
// DELETE USER
// =====================================================
const deleteUser = (req, res) => {

    const { id } = req.params;


    User.delete(id, (err, changes) => {

        if (err) {

            return res.status(500).json({
                success: false,
                message: "Failed to delete user",
                error: err.message
            });

        }


        if (changes === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }


        res.json({
            success: true,
            message: "User deleted successfully"
        });

    });

};



// =====================================================
// EXPORT
// =====================================================
module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUserStatus,
    deleteUser
};

