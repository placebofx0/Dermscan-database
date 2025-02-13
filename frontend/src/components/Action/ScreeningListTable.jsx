import React, { useEffect, useState } from "react";
import axios from "axios";
import DeleteButton from "./Delete";

const ScreeningListTable = ({ studyId }) => {
  const [pairedSubjects, setPairedSubjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studyId) return;

    const fetchPairedSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/studyprofile/${studyId}/subjects`);
        console.log("API Response:", response.data);
        setPairedSubjects(response.data);
      } catch (error) {
        console.error("Error fetching paired subjects:", error);
        setError("Error fetching paired subjects");
      }
    };

    fetchPairedSubjects();
  }, [studyId]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleStatusChange = async (relationId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/relation/${relationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Refresh the list after successful update
      const updatedSubjects = pairedSubjects.map(subject => 
        subject.relationId === relationId ? { ...subject, relationStatus: newStatus } : subject
      );
      setPairedSubjects(updatedSubjects);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleSubjectNoChange = async (relationId, newSubjectNo) => {
    try {
      const response = await fetch(`http://localhost:8000/relation/${relationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjectNo: newSubjectNo }),
      });

      if (!response.ok) {
        throw new Error('Failed to update Subject No.');
      }

      const updatedRelation = await response.json();

      // อัปเดต state ใน pairedSubjects ให้มีค่า subjectNo ใหม่
      const updatedSubjects = pairedSubjects.map(subject =>
        subject.relationId === relationId
          ? { ...subject, subjectNo: updatedRelation.subjectNo }
          : subject
      );
      setPairedSubjects(updatedSubjects);
    } catch (error) {
      console.error("Error updating Subject No.:", error);
      alert("Failed to update Subject No.");
    }
  };

  const handleRemarkChange = async (relationId, newRemark) => {
    try {
      const response = await fetch(`http://localhost:8000/relation/${relationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ remark: newRemark }),
      });

      if (!response.ok) {
        throw new Error('Failed to update remark');
      }

      const updatedRelation = await response.json();

      // อัปเดต state ใน pairedSubjects ให้มีค่า remark ใหม่
      const updatedSubjects = pairedSubjects.map(subject =>
        subject.relationId === relationId
          ? { ...subject, remark: updatedRelation.remark }
          : subject
      );
      setPairedSubjects(updatedSubjects);
    } catch (error) {
      console.error("Error updating remark:", error);
      alert("Failed to update remark");
    }
  };

  return (
    <div>
      <h2>Screening list</h2>
      {error && <p>{error}</p>}
      {pairedSubjects.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>Screening date</th>
              <th>Screening No.</th>
              <th>Subject ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Last name</th>
              <th>First name</th>
              <th>Gender</th>
              <th>Birth date</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Subject No.</th>
              <th>Remark</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pairedSubjects.map((subject, index) => (
              <tr key={index}>
                <td>{index+1}</td>
                <td>
                  {subject?.screeningDate 
                    ? new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(new Date(subject.screeningDate))
                    : "N/A"}
                </td>
                <td>{index+1}</td>
                <td>{subject?.IdNo || "N/A"}</td>
                <td>{subject?.Name || "N/A"}</td>
                <td>{subject?.Lname || "N/A"}</td>
                <td>{subject?.InitialLname || "N/A"}</td>
                <td>{subject?.InitialName || "N/A"}</td>
                <td>{subject?.Gender || "N/A"}</td>
                <td>{subject? new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(subject.BirthDate))
                  : "N/A"}</td>
                <td>{calculateAge(subject?.BirthDate) || "N/A"}</td>
                <td>{subject?.Phone || "N/A"}</td>
                <td>{subject?.Address || "N/A"}</td>
                <td>
                  <select 
                    value={subject?.relationStatus || ''}
                    onChange={(e) => handleStatusChange(subject.relationId, e.target.value)}
                  >
                    <option value="Pass">Pass</option>
                    <option value="Not pass">Not pass</option>
                  </select>
                </td>
                <td>
                  <input
                      type="text"
                      value={subject?.subjectNo || ""}
                      onChange={(e) => handleSubjectNoChange(subject.relationId, e.target.value)}
                      style={{ width: "50px", textAlign: "center" }}
                    />
                </td>
                <td>
                  <input
                      type="text"
                      value={subject?.remark || ""}
                      onChange={(e) => handleRemarkChange(subject.relationId, e.target.value)}
                      style={{ width: "100px", textAlign: "center" }}
                    />
                </td>
                <td>
                    <DeleteButton 
                    id={subject.relationId} 
                    data={pairedSubjects} 
                    setData={setPairedSubjects} 
                    filteredData={pairedSubjects} 
                    setFilteredData={setPairedSubjects} 
                    API_URL="http://localhost:8000/studyprofile" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No paired subjects</p>
      )}
    </div>
  );
};

export default ScreeningListTable;
