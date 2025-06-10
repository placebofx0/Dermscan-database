import React, { useEffect, useState } from "react";
import axios from "axios";

// ตารางแสดง Study ที่ pair กับ subjectId
const SubjectStudyListTable = ({ subjectId }) => {
  const [pairedStudies, setPairedStudies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!subjectId) return;
    const fetchPairedStudies = async () => {
      try {
        // ปรับ endpoint ให้ตรงกับ backend ที่ส่งเฉพาะข้อมูล study
        const response = await axios.get(`http://localhost:8000/subjectprofile/${subjectId}/studies`);
        setPairedStudies(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching paired studies:", err);
        setError(
          err.response?.data?.message || err.message || "Error fetching paired studies"
        );
      }
    };
    fetchPairedStudies();
  }, [subjectId]);

  return (
    <div>
      <h2>ประวัติการเข้าร่วมงานวิจัย</h2>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {pairedStudies.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Study No.</th>
              <th>Start date</th>
              <th>End date</th>
              <th>PM</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {pairedStudies.map((study, idx) => (
              <tr key={study.relationId || idx}>
                <td>{study.studyNo || "N/A"}</td>
                <td>{study.startDate ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(study.startDate)) : "N/A"}</td>
                <td>{study.endDate ? new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(study.endDate)) : "N/A"}</td>
                <td>{study.PM || "N/A"}</td>
                <td>{study.type || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No paired studies found.</p>
      )}
    </div>
  );
};

export default SubjectStudyListTable;
