const express = require("express")
const router = express.Router()
const errorController = require("../controllers/errorController")

router.get("/cause-error", errorController.buildError)

module.exports = router