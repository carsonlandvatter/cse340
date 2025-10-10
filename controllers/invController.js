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
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getVehicleById(inv_id)
  const itemData = data[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const parsedId = parseInt(inv_id)
  const parsedYear = parseInt(inv_year)
  const parsedMiles = parseInt(inv_miles)
  const parsedPrice = parseFloat(inv_price)
  const parsedClass = parseInt(classification_id)

  console.log({
    parsedId,
    parsedClass,
    parsedPrice,
    parsedYear,
    parsedMiles
  })
  
  const updateResult = await invModel.updateInventory(
    parsedId,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    parsedPrice,
    parsedYear,
    parsedMiles,
    inv_color,
    parsedClass
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont