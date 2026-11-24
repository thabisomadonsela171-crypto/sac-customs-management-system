const express = require("express");

const router = express.Router();

const {
    createDeclaration,
    getDeclarations,
    getDeclaration,
    updateDeclarationStatus
} = require("../controllers/declarationController");

router.post("/", createDeclaration);

router.get("/", getDeclarations);

router.patch("/:id/status", updateDeclarationStatus);

router.get("/:id", getDeclaration);

module.exports = router;