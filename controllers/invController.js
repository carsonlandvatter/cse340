const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

//Build vehicle single detail view
invCont.buildByInvId = async function ( req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getVehicleById(inv_id)
  let nav = await utilities.getNav()

  const item = data[0]
  const detail = utilities.buildDetail(item)
  res.render("./inventory/detail", {
    title: `${item.inv_make} ${item.inv_model}`,
    nav,
    detail,
  })
}

//Build Management view
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
    })
  } catch (error) {
    console.error("Error building management view", error)
    next(error)
  }
}

//Build Add Classification view
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  } catch (error) {
    console.error("Error building add-classification view", error)
    next(error)
  }
}

//Build Add Vehicle view
invCont.buildAddVehicle = async function (req, res, next) {
  try {
    const classifications = await invModel.getClassifications()
    let nav = await utilities.getNav()
    res.render("./inventory/add-vehicle", {
      title: "Add Vehicle",
      classifications,
      nav,
      errors: null
    })
  } catch (error) {
    console.error("Error building add-vehicle view", error)
    next(error)
  }
}

//Process adding the classification
invCont.addClassification = async function (req, res) {
  const {classification_name} = req.body
  const addResult = await invModel.addClassification(classification_name)
  if (addResult) {
    req.flash("notice", "Classification added successfully!")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Failed to add classification.")
    res.redirect("/inv/add-classification")
  }
}

//Process adding the vehicle
invCont.addVehicle = async function (req, res, next) {
  try {
    const {
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    } = req.body

    const result = await invModel.addVehicle(
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
    )

    if (result) {
      req.flash("notice", "Vehicle added successfully!")
      res.redirect("/inv/")
    } else {
      req.flash("notice", "Failed to add vehicle.")
      res.redirect("/inv/add-vehicle")
    }
  } catch (error) {
    console.error("Error adding vehicle:", error)
    next(error)
  }
}

module.exports = invCont