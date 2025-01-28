const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    IdNo: { type: String, required: true, unique: true },
    Name: { type: String, required: true },
    Lname: { type: String, required: true },
    InitialLname: { type: String },
    InitialName: { type: String },
    BirthDate: { type: Date },
    Phone: { type: String },
    Address: { type: String },
    Status: { type: String, enum: ['Active', 'Blacklist'], default: 'Active'}
});


  subjectSchema.virtual("Age").get(function () {
    if (this.BirthDate) {
        const today = new Date();
        const birthDate = new Date(this.BirthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--; // ลบ 1 ปีถ้าวันเกิดยังไม่ถึง
        }
        return age;
    }
    return null;
  });

  module.exports = mongoose.model("subjects", subjectSchema);