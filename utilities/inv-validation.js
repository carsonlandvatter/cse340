const { body, validationResult } = require("express-validator")
const utilities = require(".")

//Classification Data Validation Rules
const classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("Please provide a classification name.")
            .matches(/^[A=Za-z]+$/)
            .withMessage("Classification name must contain only alphabetic characters with no spaces.")
    ]
}

/* ******************************
 * Check classification data and return errors
 * ***************************** */
const checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    let nav = await utilities.getNav()

    const validationErrors = validationResult(req)
    if (!validationErrors.isEmpty()) {
        errors = validationErrors.array()
        return res.render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors,
            classification_name,
        })
    }
    next()
}

//Add Vehicle Validation Rules
const vehicleRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .withMessage("Please choose a classification"),

        body("inv_make")
            .trim()
            .isLength({ min: 3})
            .withMessage("Make must be a minimum of 3 characters.")
            .isAlpha()
            .withMessage("Make must be letters only"),
        
        body("inv_model")
            .trim()
            .isLength({ min: 3})
            .withMessage("Make must be a minimum of 3 characters.")
            .isAlpha()
            .withMessage("Make must be letters only"),
        
        body("inv_price")
            .notEmpty()
            .withMessage("Price is required.")
            .isFloat({ min: 0 })
            .withMessage("Price must be a valid number."),

        body("inv_year")
            .matches(/^[0-9]{4}$/)
            .withMessage("Year must only be 4 digits."),

        body("inv_miles")
            .isInt({ min: 0 })
            .withMessage("Miles must be numeric and greater than 0."),

        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color cannot be left empty.")
    ]
}

//Check vehicle data and return errors
const checkVehicleData = async (req, res, next) => {
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

    const errors = validationResult(req)
    let nav = await utilities.getNav()
    const classifications = await require("../models/inventory-model").getClassifications()

    if (!errors.isEmpty()) {
        return res.render("./inventory/add-vehicle", {
            title: "Add Vehicle",
            nav,
            classifications,
            errors: errors.array(),
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color
        })
    }
    next()
}

//Check vehicle data and return errors to edit view
const checkUpdateData = async (req, res, next) => {
    const { classification_id, inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body

    const errors = validationResult(req)
    let nav = await utilities.getNav()
    const classifications = await require("../models/inventory-model").getClassifications()

    if (!errors.isEmpty()) {
        return res.render("./inventory/edit-inventory", {
            title: "Edit Inventory",
            nav,
            classifications,
            errors: errors.array(),
            classification_id,
            inv_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color
        })
    }
    next()
}

module.exports = { classificationRules, checkClassificationData, checkVehicleData, vehicleRules, checkUpdateData }