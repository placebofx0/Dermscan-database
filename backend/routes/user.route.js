const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// Login Route
router.post("/", userController.login);

// Signup Route
router.post("/signup", userController.signup);

module.exports = router;