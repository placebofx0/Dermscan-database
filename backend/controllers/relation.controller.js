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
        remark: relation.remark
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

    const relations = await Relation.find({ subjectId }).populate("studyId");

    const pairedStudies = relations.map((rel) => rel.studyId);

    res.status(200).json(pairedStudies);
  } catch (error) {
    console.error("Error fetching paired studies:", error);
    res.status(500).json({ message: "Server error" });
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