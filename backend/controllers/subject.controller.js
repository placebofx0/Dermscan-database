const Study = require("../models/study.model");
const Relation = require("../models/relation.model");
const Subject = require("../models/subject.model");

exports.getAllSubjects = async (req, res) => {
    try {
        const subjectslist = await Subject.find(); // เรียงตาม IdNo
        res.status(200).json(subjectslist);
    } catch (err) {
        console.error("Error in subjectslisttable function:", err);
        res.status(500).json({ message: "Error retrieving data", error: err.message });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSubject = await Subject.findByIdAndUpdate(id, req.body, { new: true });
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
        console.log("Deleting subject ID:", req.params.id); // ✅ Debugging
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);
        if (!deletedSubject) {
            console.log("Subject not found");
            return res.status(404).json({ message: "Subject not found" });
        }
        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.error("Error deleting subject:", error);
        res.status(500).json({ message: "Error deleting subject", error });
    }
};

exports.getSubjectById = async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id); // ใช้ Model ที่ถูกต้อง
        if (!subject) return res.status(404).json({ error: "Subject not found" });
        res.json(subject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.createSubject = async (req, res) => {
    try {
        const existingSubject = await Subject.findOne({ IdNo: req.body.IdNo });
        if (existingSubject) {
            return res.status(400).json({ message: "Subject already exists" });
        }

        const newSubject = new Subject(req.body);
        const savedSubject = await newSubject.save();
        res.status(201).json(savedSubject);
    } catch (error) {
        res.status(400).json({ message: "Error creating subject", error });
    }
};


exports.searchSubject = async (req, res) => {
    const { query } = req.query; // รับ query จาก query string
    try {
      const subject = await Subject.findOne({
        $or: [
          { IdNo: query },
          { Name: { $regex: query, $options: "i" } },
          { Lname: { $regex: query, $options: "i" } },
        ],
      });
      if (subject) {
        res.json(subject);
      } else {
        res.status(404).json({ message: "No subject found" });
      }
    } catch (err) {
      res.status(500).json({ message: "Error searching subject", error: err });
    }
  };