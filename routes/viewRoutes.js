const express = require("express");
const viewController = require("../controllers/viewController");
const router = express.Router()
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");


router.get("/", authController.isLoggedIn, viewController.getOverview)
router.get("/tours/:slug", authController.isLoggedIn, viewController.getTour)

router.route("/signup").get(viewController.getSignupForm)

// login route

router.get("/login", authController.isLoggedIn, viewController.getLoginForm);
router.get("/me", authController.protect, viewController.getAccount);
router.get("/my-tours", authController.protect, viewController.getMyTours);

router.post("/submit-user-data", authController.protect, viewController.updateUserData);

module.exports = router;