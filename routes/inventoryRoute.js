// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inv-validation")

// Route to build management view
router.get("/", invController.buildManagement)

// Route to build add-classification view
router.get("/add-classification", invController.buildAddClassification)

// Route to process the addition of the classification
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.addClassification
)

//Route to Add Vehicle
router.post(
    "/add-vehicle",
    invValidate.vehicleRules(),
    invValidate.checkVehicleData,
    invController.addVehicle
)

// Route to build add inventory view
router.get("/add-vehicle", invController.buildAddVehicle)

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build single vehicle detail page
router.get("/detail/:inv_id", invController.buildByInvId)

module.exports = router;