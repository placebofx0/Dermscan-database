const Study = require("../models/study.model");
const Relation = require("../models/relation.model");
const subjects = require("../models/subject.model");

const subjectslisttable = async (req, res) => {
    try {
        const subjectslist = await subjects.find().sort({ IdNo: 1 }); // เรียงตาม IdNo
        res.status(200).json(subjectslist);
    } catch (err) {
        console.error("Error in subjectslisttable function:", err);
        res.status(500).json({ message: "Error retrieving data", error: err.message });
    }
};

const editsubjectprofile = async (req, res) => {
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


const deletesubject = async (req, res) => {
    try {
      const { id } = req.params;
      await Subject.findByIdAndDelete(id);
      res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting subject", error: error.message });
    }
  };

const subjectsprofile = async (req, res) => {
        try {
            const subject = await subjects.findById(req.params.id); // ใช้ findById เพื่อหาเอกสาร
            if (!subject) return res.status(404).send("Subject not found");
            res.json(subject);
        } catch (error) {
            console.error(error);
            res.status(500).send("Server error");
        }
    };

const subjectregister = async (req, res) => {
    const { IdNo, Name, Lname, InitialLname, InitialName, BirthDate, Phone, Address, Status } = req.body;

    const data = {
        IdNo,
        Name,
        Lname,
        InitialLname,
        InitialName,
        BirthDate,
        Phone,
        Address,
        Status, // ใช้ค่าจาก Status
    };

    try {
        const check = await subjects.findOne({ IdNo });

        if (check) {
            return res.json("exist"); // หากมีข้อมูลอยู่แล้วให้ส่ง "exist"
        } else {
            await subjects.insertMany([data]);
            return res.json("notexist"); // หากไม่มีข้อมูลใหม่ให้ insert
        }

    } catch (e) {
        console.error(e);
        return res.json("fail"); // ส่งกลับ "fail" หากมีข้อผิดพลาด
    }
};

module.exports = { subjectslisttable,
                   editsubjectprofile, 
                   deletesubject, 
                   subjectsprofile,
                   subjectregister };