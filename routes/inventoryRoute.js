// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inv-validation")

//Route to update inventory
router.post("/update/", invController.updateInventory)

// Route to build management view
router.get("/", invController.buildManagement)

// Route to build add-classification view
router.get("/add-classification", invController.buildAddClassification)

// Route for getting inventory by classification id
router.get("/getInventory/:classification_id", invController.getInventoryJSON)

// Route to build edit inventory view
router.get("/edit/:inv_id", invController.editInventoryView)

// Route to process the addition of the classification
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    invController.addClassification
)

//Route to update Vehicle
router.post(
    "/update",
    invValidate.vehicleRules(),
    invValidate.checkUpdateData,
    invController.addVehicle
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