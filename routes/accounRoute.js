const regValidate = require('../utilities/account-validation')
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.get("/", utilities.checkLogin, accountController.buildAccount);
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    (accountController.registerAccount)
  )

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    accountController.accountLogin
  )

// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("jwt")
    res.redirect("/")
  })
})

//Route to build edit account view
router.get("/update/:account_id", utilities.checkLogin, accountController.buildEditAccount);

//Process account info edit
router.post(
  "/update-info",
  utilities.checkLogin,
  accountController.updateAccountInfo
)

//Process account password update
router.post(
  "/update-password",
  utilities.checkLogin,
  accountController.updatePassword
)

module.exports = router;