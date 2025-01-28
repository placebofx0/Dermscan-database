const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

// Login Route
router.post("/", userController.login);

// Signup Route
router.post("/signup", userController.signup);

module.exports = router;