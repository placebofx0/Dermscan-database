const Relation = require('../models/relation.model')

exports.createRelation = async (req, res) => {
    try {
        const { relations } = req.body;

        // ตรวจสอบว่า 'relations' เป็น array
        if (!Array.isArray(relations)) {
            return res.status(400).send("Invalid data format. 'relations' should be an array.");
        }

        // ตรวจสอบแต่ละคู่ StdId และ SubjectId ก่อนว่าในฐานข้อมูลมีอยู่แล้วหรือไม่
        const uniqueRelations = [];
        const existingRelations = await Relation.find({
            $or: relations.map((relation) => ({
                StdId: relation.StdId,
                SubjectId: relation.SubjectId,
            }))
        });

        // สร้าง array ที่ไม่มีคู่ที่ซ้ำกัน
        const existingIds = existingRelations.map((relation) => ({
            StdId: relation.StdId,
            SubjectId: relation.SubjectId
        }));

        relations.forEach((relation) => {
            // ตรวจสอบว่าคู่ StdId กับ SubjectId นี้ยังไม่มีในฐานข้อมูล
            const isExist = existingIds.some(
                (existingRelation) =>
                    existingRelation.StdId === relation.StdId &&
                    existingRelation.SubjectId === relation.SubjectId
            );

            // ถ้ายังไม่มีในฐานข้อมูล ให้เพิ่มลงไป
            if (!isExist) {
                uniqueRelations.push(relation);
            }
        });

        // หากไม่มีคู่ที่ใหม่ในฐานข้อมูล
        if (uniqueRelations.length === 0) {
            return res.status(200).send("No new relations to save.");
        }

        // บันทึกข้อมูลที่ไม่ซ้ำกันลงในฐานข้อมูล
        const result = await Relation.insertMany(uniqueRelations);

        // ตรวจสอบว่า result มีข้อมูลหรือไม่
        if (result && result.length > 0) {
            return res.status(200).json({
                message: "Subjects saved successfully!",
                data: result // ส่งข้อมูลที่บันทึกกลับไป
            });
        } else {
            return res.status(500).json({
                message: "Failed to save subjects.",
                error: "No data inserted"
            });
        }
    } catch (error) {
        // แสดง error ใน console เพื่อวิเคราะห์
        console.error("Error saving relations:", error);

        // ส่ง error status พร้อมข้อความตอบกลับ
        res.status(500).json({
            message: "Failed to save subjects due to error",
            error: error.message
        });
    }
};