import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getSubjectById } from "../../../services/subject.api";

function SubjectProfile() {
    const { id } = useParams();
    const [Subject, setSubject] = useState(null);

    useEffect(() => {
        async function fetchSubject() {
            try {
                const response = await getSubjectById(id);
                setSubject(response);
            } catch (error) {
              console.error("Error fetching Subject profile:", error);
            }
        }
    fetchSubject();
}, [id]);


const calculateAge = (birthDate) => {
  if (!birthDate) return "N/A";
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--; // ลบ 1 ปีถ้ายังไม่ถึงวันเกิดในปีนี้
  }
  return age;
};

if (Subject === null) {
    return <p>Loading...</p>;
  }

  if (Subject === false) {
    return <p>Error loading Subject profile</p>;
  }

  if (!Subject) {
    return <p>No Subject found.</p>;
  }

    return (
        <div>
            <h1>
                <p>Profile: {Subject.Name} {Subject.Lname}</p>
                <p>ID card No. {Subject.IdNo}</p>
                <p>Name: {Subject.Name}</p>
                <p>Surname: {Subject.Lname}</p>
                <p>Last name: {Subject.InitialLname}</p>
                <p>First name: {Subject.InitialName}</p>
                <p>Birth date: {Subject.BirthDate
                                    ? new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    }).format(new Date(Subject.BirthDate))
                                    : "N/A"}</p>
                <p>Age: {calculateAge(Subject.BirthDate)}</p>
                <p>Phone: {Subject.Phone}</p>
                <p>Address: {Subject.Address}</p>
                <p>Status: {Subject.Status}</p>
            </h1>
        </div>
    );
}

export default SubjectProfile;