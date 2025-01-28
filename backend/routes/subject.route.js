const express = require("express");

const { subjectslisttable, 
        editsubjectprofile, 
        deletesubject,
        subjectsprofile,
        subjectregister } = require("../controllers/subject.controller");

const router = express.Router();

router.get("/subjectsmain", subjectslisttable);
router.put("/subjectsmain/:id", editsubjectprofile);
router.delete("/subjectsmain/:id", deletesubject);
router.get("/subjectprofile/:id", subjectsprofile);
router.post("/subjectregister", subjectregister);

module.exports = router;