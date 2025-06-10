const Relation = require('../models/relation.model');
const Study = require("../models/study.model");
const Subject = require("../models/subject.model"); // ตรวจสอบการนำเข้าโมเดล Subject

exports.createRelation = async (req, res) => {
  try {
    const { studyId, subjectId, remark, status, screeningNo } = req.body; // เพิ่ม screeningNo

    if (!studyId || !subjectId) {
      return res.status(400).json({
        message: "Missing required fields: studyId and subjectId are required."
      });
    }

    const newRelation = {
      studyId,
      subjectId,
      remark: remark || "",
      status: status || "Pass",
      screeningNo: screeningNo || "" // เพิ่ม screeningNo
    };

    const existingRelation = await Relation.findOne({
      studyId: newRelation.studyId,
      subjectId: newRelation.subjectId,
    });

    if (existingRelation) {
      return res.status(200).json({
        message: "This relation already exists.",
        data: existingRelation,
      });
    }

    const createdRelation = await Relation.create(newRelation);

    return res.status(200).json({
      message: "Subject paired successfully!",
      data: createdRelation,
    });
  } catch (error) {
    console.error("Error saving relation:", error);
    return res.status(500).json({
      message: "Failed to save relation due to error",
      error: error.message,
    });
  }
};

exports.getScreeninglist = async (req, res) => {
  try {
    const { studyId } = req.params;
    const relations = await Relation.find({ studyId }).populate('subjectId').exec();

    if (!relations) {
      return res.status(404).json({ message: "No relations found" });
    }

    const screeningList = relations.map(relation => {
      if (!relation.subjectId) {
        return null;
      }
      return {
        relationId: relation._id,
        screeningNo: relation.screeningNo,
        screeningDate: relation.createdAt,
        IdNo: relation.subjectId.IdNo,
        Name: relation.subjectId.Name,
        Lname: relation.subjectId.Lname,
        InitialLname: relation.subjectId.InitialLname,
        InitialName: relation.subjectId.InitialName,
        Gender: relation.subjectId.Gender,
        BirthDate: relation.subjectId.BirthDate,
        Phone: relation.subjectId.Phone,
        Address: relation.subjectId.Address,
        relationStatus: relation.status,
        subjectNo: relation.subjectNo,
        remark: relation.remark,
        endDate: relation.endDate // เพิ่ม endDate
      };
    }).filter(item => item !== null); // กรองข้อมูลที่เป็น null ออก

    res.status(200).json(screeningList);
  } catch (error) {
    console.error("Error fetching screening list:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRelationStatus = async (req, res) => {
  try {
    const { relationId } = req.params;
    const { status, subjectNo, remark, screeningNo } = req.body; // เพิ่ม screeningNo

    // สร้าง object สำหรับ update เฉพาะฟิลด์ที่ส่งเข้ามา
    const updateData = {};
    if (typeof status !== 'undefined') updateData.status = status;
    if (typeof subjectNo !== 'undefined') updateData.subjectNo = subjectNo;
    if (typeof remark !== 'undefined') updateData.remark = remark;
    if (typeof screeningNo !== 'undefined') updateData.screeningNo = screeningNo; // เพิ่ม screeningNo

    const updatedRelation = await Relation.findByIdAndUpdate(
      relationId,
      updateData,
      { new: true }
    );

    if (!updatedRelation) {
      return res.status(404).json({ message: "Relation not found" });
    }

    res.status(200).json(updatedRelation);
  } catch (error) {
    console.error("Error updating relation status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSubjectStudies = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const mongoose = require('mongoose');
    let queryObj;
    if (mongoose.Types.ObjectId.isValid(subjectId)) {
      queryObj = { subjectId: new mongoose.Types.ObjectId(subjectId) };
    } else {
      queryObj = { subjectId };
    }
    // ตรวจสอบว่า studyId ใน relation ทุกตัว populate ได้จริง
    const relations = await Relation.find(queryObj).populate('studyId').exec();

    if (!relations || relations.length === 0) {
      return res.status(200).json([]); // ส่ง array ว่าง
    }

    // filter relation ที่ studyId เป็น null หรือไม่ใช่ object (เช่น populate ไม่สำเร็จ)
    const studyList = relations.map(relation => {
      if (!relation.studyId || typeof relation.studyId !== 'object') {
        return null;
      }
      return {
        relationId: relation._id,
        studyNo: relation.studyId.StdNo,
        startDate: relation.studyId.StartDate,
        endDate: relation.studyId.EndDate,
        PM: relation.studyId.PM,
        type: relation.studyId.Type
      };
    }).filter(item => item !== null);

    res.status(200).json(studyList);
  } catch (error) {
    console.error("Error fetching paired studies:", error, error.stack);
    res.status(500).json({ message: "Server error", error: error.message, stack: error.stack });
  }
};

exports.deleteRelation = async (req, res) => {
  try {
    console.log("Deleting Relation:", req.params.id); // ✅ Debugging
    const deletedRelation = await Relation.findByIdAndDelete(req.params.id);
    if (!deletedRelation) {
      console.log("Relation not found");
      return res.status(404).json({ message: "Relation not found" });
    }
    res.status(200).json({ message: "Relation deleted successfully" });
  } catch (error) {
    console.error("Error deleting Relation:", error);
    res.status(500).json({ message: "Error deleting Relation", error });
  }
};

// Add this function to handle updating the end date
exports.updateEndDate = async (req, res) => {
  try {
    const { relationId } = req.params;
    const { endDate } = req.body;

    const updatedRelation = await Relation.findByIdAndUpdate(
      relationId,
      { endDate: endDate },
      { new: true }
    );

    if (!updatedRelation) {
      return res.status(404).json({ message: "Relation not found" });
    }

    res.status(200).json(updatedRelation);
  } catch (error) {
    console.error("Error updating end date:", error);
    res.status(500).json({ message: "Server error" });
  }
};