import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import './Modal.css'

Modal.setAppElement("#root");

const StudyModal = ({ isOpen, onClose, onStudyAdded, API_URL }) => {
    const [studyData, setStudyData] = useState({
        StdNo: "",
        StartDate: "",
        EndDate: "",
        PM: "",
        Type: ""
    });

    // ฟังก์ชันอัปเดตค่าฟอร์ม
    const handleChange = (e) => {
        setStudyData({ ...studyData, [e.target.name]: e.target.value });
    };

    // ฟังก์ชันสร้าง Study
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, studyData);
            alert("Study created successfully!");
            setStudyData({ StdNo: "",
                           StartDate: "",
                           EndDate: "", 
                           PM: "", 
                           Type: "" 
                        }); // รีเซ็ตฟอร์ม
            onStudyAdded(response.data); // อัปเดตตารางหลังเพิ่มข้อมูล
            onClose(); // ปิด Modal
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.message === "Study already exists") {
                alert("Study already exists!");
            } else {
            console.error("Error creating study:", error);
            alert("Failed to create study.");
            }
        }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Add Study" className="modal" overlayClassName="overlay">
            <h2>Add New Study</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="StdNo" placeholder="Study No" value={studyData.StdNo} onChange={handleChange} required />
                <input type="date" name="StartDate" value={studyData.StartDate} onChange={handleChange} required />
                <input type="date" name="EndDate" value={studyData.EndDate} onChange={handleChange} required />
                <input type="text" name="PM" placeholder="Project Manager" value={studyData.PM} onChange={handleChange} required />
                <input type="text" name="Type" placeholder="Type" value={studyData.Type} onChange={handleChange} required />
                <button type="submit">Add Study</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </Modal>
    );
};

export default StudyModal;
