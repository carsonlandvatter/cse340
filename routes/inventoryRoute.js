// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
// Route to build management view
router.get("/", invController.buildManagement)
// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//Route to build single vehicle detail page
router.get("/detail/:inv_id", invController.buildByInvId)

module.exports = router;