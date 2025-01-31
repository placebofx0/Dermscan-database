const express = require("express");
const router = express.Router();
const subjectController = require("../controllers/subject.controller");

router.get("/subjectsmain", subjectController.subjectslisttable);
router.put("/subjectsmain/:id", subjectController.editsubjectprofile);
router.delete("/subjectsmain/:id", subjectController.deletesubject);
router.get("/subjectprofile/:id", subjectController.subjectsprofile);
router.post("/subjectregister", subjectController.subjectregister);

module.exports = router;