const express = require("express");
const router = express.Router();
const relationController = require("../controllers/relation.controller");

router.post("/studyprofile/relation", relationController.createRelation);
router.get("/studyprofile", relationController.getScreeninglist);
router.put("/relation/:relationId", relationController.updateRelationStatus)

module.exports = router;