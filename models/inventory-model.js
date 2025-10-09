const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  try {
    const data = await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    )
    return data.rows
  } catch (error) {
    console.error("getClassifications error:", error)
    return []
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

//Get a single vehicle ID 
async function getVehicleById(inv_id) {
    try {
        const result = await pool.query(
            "SELECT * FROM public.inventory WHERE inv_id = $1",
            [inv_id]
        )
        return result.rows
    } catch (error) {
        console.error("getVehicleByID error: " + error)
    }
}

//Insert new classification
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    const result = await pool.query(sql, [classification_name])

    return result.rows[0]
  } catch (error) {
    console.error("Error addicing classification:", error)
  }
}

//Add new vehicle
async function addVehicle(
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
) {
  try {
    const sql = `
      INSERT INTO public.inventory
        (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`
    const data = await pool.query(sql, [
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
    ])
    return data.rows[0]
  } catch (error) {
    console.error("addVehicle error:", error)
  }
}
  module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addVehicle};