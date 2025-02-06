import React, { useState, useEffect } from "react";
import { getAllSubjects } from "../../../services/subject.api";
import { useNavigate } from "react-router-dom";
import DeleteButton from "../../Action/Delete";
import SubjectRegisterModal from "../../Action/SubjectRegisterModal";
import SubjectEditModal from "../../Action/SubjectEditModal";

function SubjectTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);


  const endpoint = "http://localhost:8000/subjectmain";

  // ตัวอย่างฟังก์ชันอัพเดทข้อมูลเมื่อมีการเพิ่ม Subject ใหม่
  const handleSubjectAdded = (newSubject) => {
    setData([...data, newSubject]);
    setFilteredData([...filteredData, newSubject]);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = data.filter(
      (item) =>
        item.IdNo.toLowerCase().includes(term.toLowerCase()) ||
        item.Name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };

  useEffect(() => {
    async function subjectList() {
      try {
        const response = await getAllSubjects();
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.log("Fetching data error:", error);
      }
    }
    subjectList();
  }, []);

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

  const handleViewProfile = (id) => {
    navigate(`/subjectprofile/${id}`);
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setEditModalOpen(true);
  };

  // เมื่อ subject ถูกแก้ไขเรียบร้อยแล้วใน Edit Modal
  const handleSubjectEdited = (editedSubject) => {
    const updatedData = data.map((item) =>
      item._id === editedSubject._id ? editedSubject : item
    );
    setData(updatedData);
    setFilteredData(updatedData);
  };

  return (
    <div>
      <h1>Subject List</h1>
      <div className="searchBox">
        <input
          className="searchBar"
          type="text"
          placeholder="Search by ID card No. or Name or Last name"
          value={searchTerm}
          onChange={handleSearch}
        />
      <button className="btn"  onClick={() => setModalOpen(true)}>Add Subject</button>
            <SubjectRegisterModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onSubjectAdded={handleSubjectAdded}
            API_URL={endpoint}  // ส่งค่า endpoint ที่ต้องการใช้งาน
            />
      </div>
      <table>
        <thead>
          <tr>
            <th>ID card No.</th>
            <th>Name</th>
            <th>Surname</th>
            <th>Last name</th>
            <th>First name</th>
            <th>Birth date</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td>{item.IdNo || "N/A"}</td>
              <td>{item.Name || "N/A"}</td>
              <td>{item.Lname || "N/A"}</td>
              <td>{item.InitialLname || "N/A"}</td>
              <td>{item.InitialName || "N/A"}</td>
              <td>
                {item.BirthDate
                  ? new Intl.DateTimeFormat("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }).format(new Date(item.BirthDate))
                  : "N/A"}
              </td>
              <td>{calculateAge(item.BirthDate)}</td>
              <td>{item.Phone || "N/A"}</td>
              <td>{item.Address || "N/A"}</td>
              <td>{item.Status || "N/A"}</td>
              <td>
                <button className="btn" onClick={() => handleViewProfile(item._id)}>
                  View Profile
                </button>
                <button className="btn" onClick={() => handleEdit(item)}>Edit</button>
                <SubjectEditModal
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onSubjectEdited={handleSubjectEdited}
                    API_URL={endpoint} // ใช้ endpoint เดียวกันกับ SubjectRegisterModal
                    subject={selectedSubject} // ส่งข้อมูล subject ที่เลือกแก้ไข
                    />
                <DeleteButton
                  id={item._id}
                  data={data}
                  setData={setData}
                  filteredData={filteredData}
                  setFilteredData={setFilteredData}
                  API_URL={endpoint}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubjectTable;
