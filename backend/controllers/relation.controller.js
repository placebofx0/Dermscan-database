const Relation = require('../models/relation.model')

exports.createRelation = async (req, res) => {
  try {
    // สมมุติว่า payload ที่ส่งเข้ามาจาก PairSubject มีโครงสร้างแบบนี้:
    // { studyStdNo: "12345", subjectIdNo: "ABCDEF", remark: "Optional remark", Status: "Pass" }
    const { studyStdNo, subjectIdNo, remark, Status } = req.body;

    // ตรวจสอบข้อมูลที่จำเป็นว่ามีครบหรือไม่
    if (!studyStdNo || !subjectIdNo) {
      return res.status(400).json({
        message: "Missing required fields: studyStdNo and subjectIdNo are required."
      });
    }

    // แปลงข้อมูลให้ตรงกับ model (mapping studyStdNo -> StdId, subjectIdNo -> SubjectId)
    const newRelation = {
      StdId: studyStdNo,
      SubjectId: subjectIdNo,
      remark: remark || "",         // กำหนด remark เป็นค่าว่างถ้าไม่ได้ส่งเข้ามา
      Status: Status || "Pass"        // ค่า default เป็น "Pass" หากไม่มีการส่งเข้ามา
    };

    // ตรวจสอบว่าคู่ StdId กับ SubjectId นี้มีอยู่แล้วหรือไม่
    const existingRelation = await Relation.findOne({
      StdId: newRelation.StdId,
      SubjectId: newRelation.SubjectId,
    });

    if (existingRelation) {
      return res.status(200).json({
        message: "This relation already exists.",
        data: existingRelation,
      });
    }

    // หากยังไม่มี ให้สร้างข้อมูล relation ใหม่
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


exports.updateRelationStatus = async (req, res) => {
    try {
      const { relationId } = req.params;
      const { Status } = req.body; // ค่าที่ส่งเข้ามาจะเป็น "Pass" หรือ "Not pass"
      const updatedRelation = await Relation.findByIdAndUpdate(
        relationId,
        { Status },
        { new: true }
      );
      res.json(updatedRelation);
    } catch (error) {
      console.error("Error updating pairing status:", error);
      res.status(500).json({ message: "Error updating relation status", error });
    }
  };

  exports.getScreeninglist = async (req, res) => {
    try {
      const relations = await Relation.find()
        .populate("subjectIdNo") // ดึงข้อมูลของ subject ทั้งหมด
        .exec();
  
      res.json(relations);
    } catch (error) {
      console.error("Error fetching paired subjects:", error);
      res.status(500).json({ message: "Error fetching paired subjects" });
    }
  };