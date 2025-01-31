const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subject.controller");

router.get("/subjectsmain", subjectController.getAllSubjects);
router.put("/subjectsmain/:id", subjectController.updateSubject);
router.delete("/subjectsmain/:id", subjectController.deleteSubject);
router.get("/subjectprofile/:id", subjectController.getSubjectById);
router.post("/subjectregister", subjectController.createSubject);

module.exports = router;