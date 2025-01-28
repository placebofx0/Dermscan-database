const mongoose = require("mongoose");

const studySchema = new mongoose.Schema({
    StdNo: {
      type: String,
      required: true,
    },
    StartDate: {
      type: Date,
      required: true,
    },
    EndDate: {
      type: Date,
      required: true,
    },
    PM: {
      type: String,
      required: true,
    },
    Type: {
      type: String,
      required: true,}
  });

  module.exports = mongoose.model("studies", studySchema);