/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const bodyParser = require("body-parser")
const session = require("express-session")
const pool = require('./database/')
const accountRoute = require("./routes/accounRoute")
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
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* View Engine and Templates
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

//Account route
app.use("/account", require("./routes/accounRoute"));


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

