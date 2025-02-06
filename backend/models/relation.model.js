const mongoose = require("mongoose");

const relationSchema = new mongoose.Schema({
    StdId: { type: String, required: true },
    SubjectId: { type: String, required: true },
    remark: { type: String, required: false, default: "No remark" },
    Status: { type: String, enum: ['Pass', 'Not pass'], default: 'Pass'}
  });
  
  module.exports = mongoose.model("relations", relationSchema);