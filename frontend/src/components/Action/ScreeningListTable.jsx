import React, { useEffect, useState } from "react";
import axios from "axios";

const ScreeningListTable = () => {
  const [pairedSubjects, setPairedSubjects] = useState([]);

  useEffect(() => {
    const fetchPairedSubjects = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/studyprofile/${studyId}/subjects`);
        setPairedSubjects(response.data);
      } catch (error) {
        console.error("Error fetching paired subjects:", error);
      }
    };

    fetchPairedSubjects();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Subject ID</th>
          <th>Name</th>
          <th>Age</th>
          <th>Phone</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {pairedSubjects.map((relation) => (
          <tr key={relation._id}>
            <td>{relation.subjectIdNo._id}</td>
            <td>{relation.subjectIdNo.name}</td>
            <td>{relation.subjectIdNo.age}</td>
            <td>{relation.subjectIdNo.phone}</td>
            <td>{relation.subjectIdNo.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScreeningListTable;
