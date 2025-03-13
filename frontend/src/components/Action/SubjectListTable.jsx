import React from "react";

const SubjectListTable = ({ subjects }) => {
  // กรองเฉพาะ subjects ที่มี status เป็น Pass
  const passedSubjects = subjects
    .filter(subject => subject.relationStatus === "Pass")
    .sort((a, b) => a.subjectNo - b.subjectNo); // เรียงตาม SubjectNo

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
                <td></td>
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