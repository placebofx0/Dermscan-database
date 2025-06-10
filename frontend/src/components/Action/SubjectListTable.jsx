import React from "react";

const SubjectListTable = ({ subjects }) => {
  // กรองเฉพาะ subjects ที่มี status เป็น Pass
  const passedSubjects = subjects
    .filter(subject => subject.relationStatus === "Pass")
    .sort((a, b) => a.subjectNo - b.subjectNo); // เรียงตาม SubjectNo

  const formatDate = (date) => {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ฟังก์ชันแปลง input เป็น Date (รองรับ 01/01/2025, 01-01-2025, 01/01/25, 01-01-25)
  const parseInputDate = (input) => {
    input = input.trim();
    let day, month, year;
    let parts = [];

    if (input.includes("/") || input.includes("-")) {
      parts = input.split(/[-/]/);
      if (parts.length !== 3) return null;
      [day, month, year] = parts;
    } else if (input.length === 6) {
      day = input.slice(0, 2);
      month = input.slice(2, 4);
      year = input.slice(4, 6);
    } else if (input.length === 8) {
      day = input.slice(0, 2);
      month = input.slice(2, 4);
      year = input.slice(4, 8);
    } else {
      return null;
    }

    // year: 2 หลัก -> 20xx, 4 หลัก -> 그대로
    if (year.length === 2) {
      year = parseInt(year, 10) > 50 ? `19${year}` : `20${year}`;
    }
    if (!/^\d+$/.test(day) || !/^\d+$/.test(month) || !/^\d+$/.test(year)) return null;

    const dateStr = `${year}-${month}-${day}`;
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return null;
    return dateObj;
  };

  // ฟังก์ชันแปลง input เป็น DD/MM/YYYY
  const normalizeInputDate = (input) => {
    const dateObj = parseInputDate(input);
    if (!dateObj) return input;
    return formatDate(dateObj);
  };

  const handleEndDateChange = async (relationId, inputValue, e) => {
    const dateObj = parseInputDate(inputValue);
    if (!dateObj) {
      alert('กรุณาใส่วันที่ในรูปแบบที่ถูกต้อง เช่น 01/01/25, 01-01-25, 01/01/2025, 01-01-2025 หรือ 010125');
      // รีเซ็ตค่า input ให้เป็นค่าว่าง
      e.target.value = '';
      return;
    }
    // set input เป็น DD/MM/YYYY
    e.target.value = formatDate(dateObj);
    try {
      const response = await fetch(`http://localhost:8000/relation/${relationId}/enddate`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endDate: dateObj }),
      });
      if (!response.ok) throw new Error('ไม่สามารถอัพเดทวันที่ได้');
    } catch (error) {
      console.error("Error:", error);
      alert("ไม่สามารถอัพเดทวันที่ได้");
    }
  };

  return (
    <div>
      <h2>Subject list</h2>
      {passedSubjects.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Subject No.</th>
              <th>Screening No.</th>
              <th>ID card No.</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Last name</th>
              <th>First name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Birth date</th>
              <th>Inclusion date</th>
              <th>End date</th>
              <th>Tel.</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {passedSubjects.map((subject, index) => (
              <tr key={index}>
                <td>{subject?.subjectNo || "N/A"}</td>
                <td>{subject?.screeningNo || "N/A"}</td>
                <td>{subject?.IdNo || "N/A"}</td>
                <td>{subject?.Name || "N/A"}</td>
                <td>{subject?.Lname || "N/A"}</td>
                <td>{subject?.InitialLname || "N/A"}</td>
                <td>{subject?.InitialName || "N/A"}</td>
                <td>{subject?.Gender || "N/A"}</td>
                <td>{calculateAge(subject?.BirthDate) || "N/A"}</td>
                <td>
                  {subject
                    ? new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(new Date(subject.BirthDate))
                    : "N/A"}
                </td>
                <td>
                  {subject?.screeningDate
                    ? new Intl.DateTimeFormat("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }).format(new Date(subject.screeningDate))
                    : "N/A"}
                </td>
                <td>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY, DD-MM-YYYY, DD/MM/YY, DD-MM-YY, 010125"
                    defaultValue={subject?.endDate ? formatDate(subject.endDate) : ''}
                    onBlur={(e) => {
                      const inputValue = e.target.value;
                      if (inputValue) {
                        // แปลง input เป็น DD/MM/YYYY ก่อนแสดง
                        e.target.value = normalizeInputDate(inputValue);
                        handleEndDateChange(subject.relationId, inputValue, e);
                      }
                    }}
                    style={{ width: "120px", textAlign: "center" }}
                  />
                </td>
                <td>{subject?.Phone || "N/A"}</td>
                <td>{subject?.Address || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No passed subjects</p>
      )}
    </div>
  );
};

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

export default SubjectListTable;