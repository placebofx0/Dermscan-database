const express = require("express");
const router = express.Router();
const studyController = require("../controllers/study.controller");

// กำหนด API และบอกว่า Controller ไหนต้องจัดการ
router.get("/studymain", studyController.getAllStudies); // ดึงข้อมูลทั้งหมด
router.get("/studyprofile/:id", studyController.getStudyById); // ดึงข้อมูลเฉพาะตัว
router.post("/studymain", studyController.createStudy); // เพิ่มข้อมูล
router.put("/studymain/:id", studyController.updateStudy); // แก้ไขข้อมูล
router.delete("/studymain/:id", studyController.deleteStudy); // ลบข้อมูล

module.exports = router;