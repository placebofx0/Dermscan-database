const mongoose = require("mongoose");

const relationSchema = new mongoose.Schema({
  studyId: { type: mongoose.Schema.Types.ObjectId, ref: "Study", required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
  remark: { type: String, required: false, default: "No remark" },
  status: { type: String, enum: ['Pass', 'Not pass'], default: '' },
  subjectNo: { type: String, required: false, default: "NA" },
  screeningNo: { type: String, required: false, default: "" }, // เพิ่มฟิลด์นี้
}, { timestamps: true });

module.exports = mongoose.model("Relation", relationSchema);