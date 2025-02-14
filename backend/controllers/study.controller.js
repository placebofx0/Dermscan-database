const Study = require("../models/study.model");
const Relation = require("../models/relation.model")

// ดึงข้อมูลทั้งหมด
exports.getAllStudies = async (req, res) => {
    try {
        const studies = await Study.find(); // ดึงข้อมูลทั้งหมดจากฐานข้อมูล
        res.status(200).json(studies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching studies", error });
    }
};

// ดึงข้อมูลเฉพาะ ID
exports.getStudyById = async (req, res) => {
    try {
        const study = await Study.findById(req.params.id);
        if (!study) return res.status(404).json({ message: "Study not found" });
        res.status(200).json(study);
    } catch (error) {
        res.status(500).json({ message: "Error fetching study", error });
    }
};

// เพิ่มข้อมูลใหม่
exports.createStudy = async (req, res) => {
    try {
        const existingStudy = await Study.findOne({ StdNo: req.body.StdNo });
        if (existingStudy) {
            return res.status(400).json({ message: "Study already exists" });
        }

        const newStudy = new Study(req.body); // สร้างข้อมูลใหม่
        const savedStudy = await newStudy.save(); // บันทึกลงฐานข้อมูล
        res.status(201).json(savedStudy);
    } catch (error) {
        res.status(400).json({ message: "Error creating study", error });
    }
};

// แก้ไขข้อมูล
exports.updateStudy = async (req, res) => {
    try {
            const { id } = req.params;
            const updatedStudy = await Study.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedStudy) {
                return res.status(404).send("Record not found");
            }
            res.status(200).send(updatedStudy);
        } catch (error) {
            console.error("Error updating Study:", error);
            res.status(500).send("Internal server error");
        }
    };

// ลบข้อมูล
exports.deleteStudy = async (req, res) => {
    try {
        console.log("Deleting study ID:", req.params.id); // ✅ Debugging
        const deletedStudy = await Study.findByIdAndDelete(req.params.id);
        if (!deletedStudy) {
            console.log("Study not found");
            return res.status(404).json({ message: "Study not found" });
        }
        res.status(200).json({ message: "Study deleted successfully" });
    } catch (error) {
        console.error("Error deleting study:", error);
        res.status(500).json({ message: "Error deleting study", error });
    }
};