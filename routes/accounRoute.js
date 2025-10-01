const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
/* Process Registration */
router.post("/register", accountController.registerAccount);

module.exports = router;