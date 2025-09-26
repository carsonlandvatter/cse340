const utilities = require("../utilities/")

const errorController = {}

errorController.buildError = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.status(500).render("error", {
        title: "Error",
        nav,
        message: "Intentional 500 error for testing"
    })
}

module.exports = errorController