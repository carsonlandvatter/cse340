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

module.exports = invCont