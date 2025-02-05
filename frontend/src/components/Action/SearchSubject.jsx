import React, { useState } from "react";
import axios from "axios";

const SearchSubject = ({ apiUrl, onSearchResult }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Please enter a search term.");
      return;
    }

    try {
      // ตัวอย่างการเรียก API: http://localhost:8000/studyprofile?query=...
      const response = await axios.get(`${apiUrl}/studyprofile`, {
        params: { query },
      });
      onSearchResult(response.data);
    } catch (error) {
      console.error("Error searching subjects:", error);
      onSearchResult(null);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by IdNo, Name, or Surname"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="searchBar"
      />
      <button className="btn" onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchSubject;




// import React from "react";

// const { id } = useParams();
// const [Study, setStudy] = useState(null);
// const [query, setQuery] = useState(""); // สำหรับ search input
// const [searchResult, setSearchResult] = useState(null); // ผลลัพธ์จากการค้นหา
// const [addedSubjects, setAddedSubjects] = useState([]); // สำหรับเก็บรายชื่อที่เพิ่ม

// const SearchSubject = async () => {
//     if (!query.trim()) {
//         alert("Please enter a search term.");
//         return;
//     }

//     try {
//         const response = await axios.get(`http://localhost:8000/studyprofile?query=${query}`);
//         setSearchResult(response.data);
//     } catch (error) {
//         console.error("Error searching subjects:", error);
//     }
// };

//   const addSubjectToTable = () => {
//       if (searchResult && !addedSubjects.some((item) => item.IdNo === searchResult.IdNo)) {
//           setAddedSubjects([...addedSubjects, searchResult]);
//           setSearchResult(null); // ล้างผลลัพธ์หลังจากเพิ่ม
//           setQuery(""); // ล้างช่องค้นหา
//       }
//   };

//   const saveSubjects = async () => {
//     if (addedSubjects.length === 0) {
//         alert("No subjects to save.");
//         return;
//     }

//     try {
//         // สร้างข้อมูลที่ต้องการส่งไป
//         const relationData = addedSubjects.map(subject => ({
//             StdId: Study.StdNo, // ใช้ StdNo จากข้อมูล Study
//             SubjectId: subject.IdNo, // ใช้ IdNo จากข้อมูล subject
//             remark: subject.Remark && subject.Remark.trim() !== "" ? subject.Remark : "No remark" // ตรวจสอบค่า Remark ถ้าเป็นค่าว่างให้ตั้งเป็น "No remark"
//         }));

//         // ตรวจสอบค่า relationData
//         console.log("Relation data being sent:", relationData);  // ดูข้อมูลที่จะส่งไป

//         // ส่งข้อมูลไปยัง API ที่บันทึกใน collection relation
//         const response = await axios.post(`http://localhost:8000/relation`, { relations: relationData });

//         if (response.data && response.data.message === "Subjects saved successfully!") {
//             alert("Subjects saved successfully!");
//             console.log("Saved subjects:", response.data.data); // แสดงข้อมูลที่บันทึก
//         } else {
//             alert("No new relations to save.");
//             console.log(response.data.message); // แสดงข้อความจาก API
//         }
//     } catch (error) {
//         console.error("Error saving subjects:", error.response || error);
//         alert("Error saving subjects.");
//     }
// };
// exports.serchSubject = async (req, res) => {
//     const { query } = req.query; // รับ query จาก query string
//     try {
//         const subjectsList = await Subject.findOne({
//             $or: [
//                 { IdNo: query },
//                 { Name: { $regex: query, $options: "i" } },
//                 { Lname: { $regex: query, $options: "i" } },
//             ],
//         });
//         if (subjectsList) {
//             res.json(subjectsList);
//         } else {
//             res.status(404).json({ message: "No subject found" });
//         }
//     } catch (err) {
//         res.status(500).json({ message: "Error searching subject", error: err });
//     }
// };

// exports.createRelation = async (req, res) => {
//     try {
//         const { relations } = req.body;

//         // ตรวจสอบว่า 'relations' เป็น array
//         if (!Array.isArray(relations)) {
//             return res.status(400).send("Invalid data format. 'relations' should be an array.");
//         }

//         // ตรวจสอบแต่ละคู่ StdId และ SubjectId ก่อนว่าในฐานข้อมูลมีอยู่แล้วหรือไม่
//         const uniqueRelations = [];
//         const existingRelations = await Relation.find({
//             $or: relations.map((relation) => ({
//                 StdId: relation.StdId,
//                 SubjectId: relation.SubjectId,
//             }))
//         });

//         // สร้าง array ที่ไม่มีคู่ที่ซ้ำกัน
//         const existingIds = existingRelations.map((relation) => ({
//             StdId: relation.StdId,
//             SubjectId: relation.SubjectId
//         }));

//         relations.forEach((relation) => {
//             // ตรวจสอบว่าคู่ StdId กับ SubjectId นี้ยังไม่มีในฐานข้อมูล
//             const isExist = existingIds.some(
//                 (existingRelation) =>
//                     existingRelation.StdId === relation.StdId &&
//                     existingRelation.SubjectId === relation.SubjectId
//             );

//             // ถ้ายังไม่มีในฐานข้อมูล ให้เพิ่มลงไป
//             if (!isExist) {
//                 uniqueRelations.push(relation);
//             }
//         });

//         // หากไม่มีคู่ที่ใหม่ในฐานข้อมูล
//         if (uniqueRelations.length === 0) {
//             return res.status(200).send("No new relations to save.");
//         }

//         // บันทึกข้อมูลที่ไม่ซ้ำกันลงในฐานข้อมูล
//         const result = await Relation.insertMany(uniqueRelations);

//         // ตรวจสอบว่า result มีข้อมูลหรือไม่
//         if (result && result.length > 0) {
//             return res.status(200).json({
//                 message: "Subjects saved successfully!",
//                 data: result // ส่งข้อมูลที่บันทึกกลับไป
//             });
//         } else {
//             return res.status(500).json({
//                 message: "Failed to save subjects.",
//                 error: "No data inserted"
//             });
//         }
//     } catch (error) {
//         // แสดง error ใน console เพื่อวิเคราะห์
//         console.error("Error saving relations:", error);

//         // ส่ง error status พร้อมข้อความตอบกลับ
//         res.status(500).json({
//             message: "Failed to save subjects due to error",
//             error: error.message
//         });
//     }
// };