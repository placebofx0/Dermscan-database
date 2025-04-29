import React, { useState, useEffect } from "react";
import { getAllSubjects } from "../../../services/subject.api";
import { useNavigate } from "react-router-dom";
import DeleteButton from "../../Action/Delete";
import SubjectRegisterModal from "../../Action/SubjectRegisterModal";
import SubjectEditModal from "../../Action/SubjectEditModal";
import * as XLSX from "xlsx"; // Import ไลบรารี xlsx

function SubjectTable() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false); // สำหรับ Modal เลือกคอลัมน์
  const [selectedColumns, setSelectedColumns] = useState([]); // คอลัมน์ที่เลือก

  const endpoint = "http://localhost:8000/subjectmain";

  const allColumns = [
    { header: "ID card No.", key: "IdNo" },
    { header: "Name", key: "Name" },
    { header: "Surname", key: "Lname" },
    { header: "Last name", key: "InitialLname" },
    { header: "First name", key: "InitialName" },
    { header: "Gender", key: "Gender" },
    { header: "Birth date", key: "BirthDate" },
    { header: "Age", key: "Age" },
    { header: "Phone", key: "Phone" },
    { header: "Address", key: "Address" },
    { header: "Status", key: "Status" },
  ];

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

  const handleSubjectEdited = (editedSubject) => {
    const updatedData = data.map((item) =>
      item._id === editedSubject._id ? editedSubject : item
    );
    setData(updatedData);
    setFilteredData(updatedData);
  };

  // ฟังก์ชันสำหรับ Export ข้อมูลเป็น Excel
  const handleExportToExcel = () => {
    if (selectedColumns.length === 0) {
      alert("Please select at least one column to export.");
      return;
    }

    // แปลงข้อมูล filteredData ให้ตรงกับคอลัมน์ที่เลือก
    const formattedData = filteredData.map((item) => {
      const row = {};
      selectedColumns.forEach((col) => {
        if (col.key === "BirthDate") {
          row[col.key] = item.BirthDate
            ? new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(item.BirthDate))
            : "N/A";
        } else if (col.key === "Age") {
          row[col.key] = calculateAge(item.BirthDate);
        } else {
          row[col.key] = item[col.key] || "N/A";
        }
      });
      return row;
    });

    // สร้าง worksheet พร้อมหัวตาราง
    const worksheet = XLSX.utils.json_to_sheet(formattedData, {
      header: selectedColumns.map((col) => col.key),
    });

    // กำหนดชื่อหัวตารางใน worksheet
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [selectedColumns.map((col) => col.header)],
      { origin: "A1" }
    );

    // สร้าง workbook และเพิ่ม worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Subjects");

    // บันทึกไฟล์ Excel
    XLSX.writeFile(workbook, "Subjects.xlsx");
    setExportModalOpen(false); // ปิด Modal หลังจาก Export เสร็จ
  };

  const toggleColumnSelection = (key) => {
    if (selectedColumns.some((col) => col.key === key)) {
      setSelectedColumns(selectedColumns.filter((col) => col.key !== key));
    } else {
      const column = allColumns.find((col) => col.key === key);
      setSelectedColumns([...selectedColumns, column]);
    }
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
        <button className="btn" onClick={() => setModalOpen(true)}>Add Subject</button>
        <button className="btn" onClick={() => setExportModalOpen(true)}>Export to Excel</button> {/* ปุ่มเปิด Modal */}
        <SubjectRegisterModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubjectAdded={handleSubjectAdded}
          API_URL={endpoint}
        />
      </div>

      {/* Modal สำหรับเลือกคอลัมน์ */}
      {exportModalOpen && (
        <div className="modal">
          <h2>Select Columns to Export</h2>
          <div>
            {allColumns.map((col) => (
              <div key={col.key}>
                <input
                  type="checkbox"
                  id={col.key}
                  checked={selectedColumns.some((selected) => selected.key === col.key)}
                  onChange={() => toggleColumnSelection(col.key)}
                />
                <label htmlFor={col.key}>{col.header}</label>
              </div>
            ))}
          </div>
          <button className="btn" onClick={handleExportToExcel}>Export</button>
          <button className="btn" onClick={() => setExportModalOpen(false)}>Cancel</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID card No.</th>
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
              <td>{item.Gender || "N/A"}</td>
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
                  API_URL={endpoint}
                  subject={selectedSubject}
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
