const express = require("express");

const router = express.Router();

const {
    createDocument,
    getDocuments,
    getDocument,
    verifyDocument
} = require("../controllers/documentController");

router.post("/", createDocument);

router.get("/", getDocuments);

router.patch("/:id/verify", verifyDocument);

router.get("/:id", getDocument);

module.exports = router;