const Study = require("../models/study.model");
const Relation = require("../models/relation.model");
const subjects = require("../models/subject.model");

exports.getAllSubjects = async (req, res) => {
    try {
        const subjectslist = await subjects.find().sort({ IdNo: 1 }); // เรียงตาม IdNo
        res.status(200).json(subjectslist);
    } catch (err) {
        console.error("Error in subjectslisttable function:", err);
        res.status(500).json({ message: "Error retrieving data", error: err.message });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSubject = await subjects.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedSubject) {
            return res.status(404).send("Record not found");
        }
        res.status(200).send(updatedSubject);
    } catch (error) {
        console.error("Error updating subject:", error);
        res.status(500).send("Internal server error");
    }
};


exports.deleteSubject = async (req, res) => {
    try {
      const { id } = req.params;
      await Subject.findByIdAndDelete(id);
      res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting subject", error: error.message });
    }
  };

exports.getSubjectById = async (req, res) => {
        try {
            const subject = await subjects.findById(req.params.id); // ใช้ findById เพื่อหาเอกสาร
            if (!subject) return res.status(404).send("Subject not found");
            res.json(subject);
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error");
        }
    };

exports.createSubject = async (req, res) => {
    try {
        const newSubject = new subjects(req.body); // สร้างข้อมูลใหม่
        const savedSubject = await newSubject.save(); // บันทึกลงฐานข้อมูล
        res.status(201).json(savedSubject);
    } catch (error) {
        res.status(400).json({ message: "Error creating subject", error });
    }
};