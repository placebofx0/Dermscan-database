import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

Modal.setAppElement("#root");

const SubjectRegisterModal = ({ isOpen, onClose, onSubjectAdded, API_URL }) => {
  const [subjectData, setSubjectData] = useState({
    IdNo: "",
    Name: "",
    Lname: "",
    InitialLname: "",
    InitialName: "",
    BirthDate: "",
    Phone: "",
    Address: "",
    Status: "Active", // กำหนดค่าเริ่มต้นเป็น Active
  });

  const handleChange = (e) => {
    setSubjectData({ ...subjectData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(API_URL, subjectData);
        alert("Subject created successfully!");
        setSubjectData({
            IdNo: "",
            Name: "",
            Lname: "",
            InitialLname: "",
            InitialName: "",
            BirthDate: "",
            Phone: "",
            Address: "",
            Status: "Active",
        });
        onSubjectAdded(response.data);
        onClose();
    } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message === "Subject already exists") {
            alert("Subject already exists!");
        } else {
            console.error("Error creating subject:", error);
            alert("Failed to create subject.");
        }
    }
};

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Add Subject"
      className="modal"
      overlayClassName="overlay"
    >
      <h2>Add New Subject</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="IdNo"
          placeholder="Id card No"
          value={subjectData.IdNo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Name"
          placeholder="Name"
          value={subjectData.Name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Lname"
          placeholder="Surname"
          value={subjectData.Lname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="InitialLname"
          placeholder="Last name"
          value={subjectData.InitialLname}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="InitialName"
          placeholder="First name"
          value={subjectData.InitialName}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="BirthDate"
          placeholder="Birth date (YYYY-MM-DD)"
          value={subjectData.BirthDate}
          onChange={handleChange}
        />
        <input
          type="text"
          name="Phone"
          placeholder="Tel."
          value={subjectData.Phone}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Address"
          placeholder="Address"
          value={subjectData.Address}
          onChange={handleChange}
          required
        />
        <label>Status:</label>
        <select name="Status" value={subjectData.Status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Blacklist">Blacklist</option>
        </select>
        <button type="submit">Add Subject</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default SubjectRegisterModal;
