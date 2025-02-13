const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subject.controller");

router.get("/subjectmain", subjectController.getAllSubjects);
router.get("/subjectprofile/:id", subjectController.getSubjectById);
router.post("/subjectmain", subjectController.createSubject);
router.post("/studyprofile", subjectController.createSubject);
router.put("/subjectmain/:id", subjectController.updateSubject);
router.put("/studyprofile/:id", subjectController.updateSubject);
router.delete("/subjectmain/:id", subjectController.deleteSubject);
router.get("/studyprofile", subjectController.searchSubject);

module.exports = router;