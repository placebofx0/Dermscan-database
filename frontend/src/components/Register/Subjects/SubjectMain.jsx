import React, { useState, useEffect } from "react";
import { getAllSubjects } from "../../../services/subject.api";
import { Navigate, useNavigate, Link } from "react-router-dom";
import DeleteButton from "../../Action/Delete";
import SubjectModal from "../../Action/SubjectRegisterModal";

function SubjectTable() {
    const history = useNavigate();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    // ฟังก์ชันค้นหาข้อมูล
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // ฟิลเตอร์ข้อมูลตามคำค้นหา
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
                    setData(response); // รับข้อมูลและตั้งค่าให้กับ data
                    setFilteredData(response); // ตั้งค่าข้อมูลที่แสดงให้เหมือนกับ data
                } catch (error) {
                    console.log("Fetching data error:", error);
                }
            }
            subjectList();
        }, []);

    const handleSubjectAdded = (newSubject) => {
    setData([...data, newSubject]);
    setFilteredData([...filteredData, newSubject]);
    };   

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
                    style={{ marginBottom: "20px", padding: "10px", width: "50%" }}
                />
                <button onClick={() => setModalOpen(true)}>Add Subject</button>
                <SubjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubjectAdded={handleSubjectAdded} API_URL="subjects/subjectmain" />
            </div>
            <table border="1" style={{ width: "100%", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>ID No</th>
                        <th>Name</th>
                        <th>Last Name</th>
                        <th>Initial last name</th>
                        <th>Initial name</th>
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
                                    ? new Intl.DateTimeFormat('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                    }).format(new Date(item.BirthDate))
                                    : "N/A"}
                            </td>
                            <td>{calculateAge(item.BirthDate)}</td>
                            <td>{item.Phone || "N/A"}</td>
                            <td>{item.Address || "N/A"}</td>
                            <td>{item.Status || "N/A"}</td>
                            <td>
                                <button onClick={() => handleViewProfile(item._id)}>View Profile</button>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                                <button onClick={() => handleDelete(item._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default SubjectTable;