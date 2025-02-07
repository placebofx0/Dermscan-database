const express = require("express");
const router = express.Router();
const relationController = require("../controllers/relation.controller");

router.post("/studyprofile/relation", relationController.createRelation);
router.get("/studyprofile/:studyId/subjects", relationController.getScreeninglist);
router.get("/subjectprofile/:subjectId/studies", relationController.getSubjectStudies);
router.put("/relation/:relationId", relationController.updateRelationStatus);
router.delete("/relation/:relationId", relationController.deleteRelation);

module.exports = router;