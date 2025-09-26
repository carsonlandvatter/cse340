/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const utilities = require("./utilities/")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
const baseController = require("./controllers/baseController")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

//Tell express to serve files from /public
app.use(express.static("public"))
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static)
//Index route
app.get("/", baseController.buildHome) /*(req, res){
  res.render("index", {title: "Home"})
})*/
// Inventory routes
app.use("/inv", inventoryRoute)
/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/

//Error Route
app.use("/", errorRoute)
const port = process.env.PORT
const host = process.env.HOST


//Error handling middleware
app.use(async (err, req, res, next) => {
  console.error(err.stack)
  let nav = await utilities.getNav()
  res.status(500).render("error", {
    title: "Error",
    nav,
    message: err.message || "Something went wrong on our side."
    })
  })

  /* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})