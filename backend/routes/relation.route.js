const express = require("express");
const router = express.Router();
const relationController = require("../controllers/relation.controller");

router.post("/studyprofile/relation", relationController.createRelation);
router.get("/studyprofile/:studyId/subjects", relationController.getScreeninglist);
router.get("/subjectprofile/:subjectId/studies", relationController.getSubjectStudies);
router.put("/relation/:relationId", relationController.updateRelationStatus);
router.delete("/studymain/:id", relationController.deleteRelation);

module.exports = router;