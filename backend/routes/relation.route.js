const express = require("express");
const router = express.Router();
const relationController = require("../controllers/relation.controller");

router.post("/relation", relationController.createRelation);

module.exports = router;