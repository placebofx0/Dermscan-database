import React, { useState, useEffect } from "react";
import { getAllStudies } from "../../../services/study.api";
import { Navigate, useNavigate, Link } from "react-router-dom";
import DeleteButton from "../../Action/Delete";
import StudyRegisterModal from "../../Action/StudyRegisterModal";
import StudyEditModal from "../../Action/StudyEditModal";

function StudyTable() {
    const history = useNavigate();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedStudy, setSelectedStudy] = useState(null);

    const endpoint = "http://localhost:8000/studymain";

    const handleStudyAdded = (newStudy) => {
        setData([...data, newStudy]);
        setFilteredData([...filteredData, newStudy]);
    };

    // ฟังก์ชันค้นหาข้อมูล
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);

        // ฟิลเตอร์ข้อมูลตามคำค้นหา
        const filtered = data.filter(
            (item) =>
                item.StdNo.toLowerCase().includes(term.toLowerCase()) ||
                item.Type.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // ดึงข้อมูลทั้งหมดจาก API
    useEffect(() => {
        async function studyList() {
            try {
                const response = await getAllStudies();
                setData(response); // รับข้อมูลและตั้งค่าให้กับ data
                setFilteredData(response); // ตั้งค่าข้อมูลที่แสดงให้เหมือนกับ data
            } catch (error) {
                console.log("Fetching data error:", error);
            }
        }
        studyList();
    }, []);

    const handleViewProfile = (id) => {
        history(`/studyprofile/${id}`);
    };

    const handleEdit = (study) => {
        setSelectedStudy(study);
        setEditModalOpen(true);
      };

    const handleStudyEdited = (editedStudy) => {
        const updatedData = data.map((item) =>
          item._id === editedStudy._id ? editedStudy : item
        );
        setData(updatedData);
        setFilteredData(updatedData);
      };

    return (
        <div>
            <h1>Study List</h1>
            <div className="searchBox">
                <input
                    className="searchBar"
                    type="text"
                    placeholder="Search by Study No. or Study type"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button className="btn" onClick={() => setModalOpen(true)}>Add Study</button>
                    <StudyRegisterModal 
                    isOpen={modalOpen} 
                    onClose={() => setModalOpen(false)} 
                    onStudyAdded={handleStudyAdded} 
                    API_URL={endpoint}/>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Study No</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>PM</th>
                        <th>Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item._id}>
                            <td>{item.StdNo || "N/A"}</td>
                            <td>
                                {item.StartDate
                                    ? new Intl.DateTimeFormat("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                      }).format(new Date(item.StartDate))
                                    : "N/A"}
                            </td>
                            <td>
                                {item.EndDate
                                    ? new Intl.DateTimeFormat("en-GB", {
                                          day: "2-digit",
                                          month: "2-digit",
                                          year: "numeric",
                                      }).format(new Date(item.EndDate))
                                    : "N/A"}
                            </td>
                            <td>{item.PM || "N/A"}</td>
                            <td>{item.Type || "N/A"}</td>
                            <td>
                                <button className="btn" onClick={() => handleViewProfile(item._id)}>
                                    View Profile
                                </button>
                                <button className="btn" onClick={() => handleEdit(item)}>Edit</button>
                                    <StudyEditModal
                                        isOpen={editModalOpen}
                                        onClose={() => setEditModalOpen(false)}
                                        onStudyEdited={handleStudyEdited}
                                        API_URL={endpoint} // ใช้ endpoint เดียวกันกับ StudyRegisterModal
                                        study={selectedStudy} // ส่งข้อมูล subject ที่เลือกแก้ไข
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

export default StudyTable;
