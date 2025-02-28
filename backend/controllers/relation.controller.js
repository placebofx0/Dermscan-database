const Relation = require('../models/relation.model');
const Study = require("../models/study.model");
const Subject = require("../models/subject.model"); // ตรวจสอบการนำเข้าโมเดล Subject

exports.createRelation = async (req, res) => {
  try {
    const { studyId, subjectId, remark, status } = req.body;

    if (!studyId || !subjectId) {
      return res.status(400).json({
        message: "Missing required fields: studyId and subjectId are required."
      });
    }

    const newRelation = {
      studyId,
      subjectId,
      remark: remark || "",
      status: status || "Pass"
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

    //console.log("Fetching study with id:", studyId);

    // ค้นหา Relations ที่เกี่ยวข้องกับ Study ผ่าน studyId และ populate subjectId
    const relations = await Relation.find({ studyId }).populate("subjectId");

    //console.log("Relations found:", relations);

    // ดึงข้อมูลเฉพาะ Subject จาก Relation พร้อมกับข้อมูล relation อื่น ๆ
    const pairedSubjects = relations.map((rel) => ({
      ...rel.subjectId.toObject(),
      relationId: rel._id,
      relationStatus: rel.status,
      screeningDate: rel.createdAt,
      subjectNo: rel.subjectNo,   // เพิ่ม subjectNo จาก relation
      remark: rel.remark          // เพิ่ม remark จาก relation
    }));

    res.status(200).json(pairedSubjects);
  } catch (error) {
    console.error("Error fetching paired subjects:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateRelationStatus = async (req, res) => {
  try {
    const { relationId } = req.params;
    const { status, subjectNo, remark } = req.body;

    // สร้าง object สำหรับ update เฉพาะฟิลด์ที่ส่งเข้ามา
    const updateData = {};
    if (typeof status !== 'undefined') updateData.status = status;
    if (typeof subjectNo !== 'undefined') updateData.subjectNo = subjectNo;
    if (typeof remark !== 'undefined') updateData.remark = remark;

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