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
const utilities = require("./utilities/")
const baseController = require("./controllers/baseController")
const env = require("dotenv").config()
const cookieParser = require("cookie-parser")

//Load core dependencies
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const app = express()


//Importing Routes with require statements
const accountRoute = require("./routes/accounRoute")
const inventoryRoute = require("./routes/inventoryRoute")
const errorRoute = require("./routes/errorRoute")
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

//Cookie parser middleware
app.use(cookieParser())

//Check Token Middleware
app.use(utilities.checkJWTToken)

/* View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

//Make login info available to all views
app.use((req, res, next) => {
  res.locals.loggedin = req.session.loggedin ? true : false
  res.locals.firstname = req.session.accountData ? req.session.accountData.account_firstname : null
  next()
})

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

