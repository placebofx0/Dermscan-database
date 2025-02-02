import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

// กำหนดให้ Modal รู้จัก element หลักของแอป
Modal.setAppElement("#root");

const StudyEditModal = ({ isOpen, onClose, onStudyEdited, API_URL, study }) => {
  const [editingItem, setEditingItem] = useState(study);

  useEffect(() => {
    setEditingItem(study);
  }, [study]);

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editingItem._id}`, editingItem);
      alert("Record updated successfully!");
      onStudyEdited(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update record.");
    }
  };

  const handleModalClose = () => {
    onClose();
  };

  if (!editingItem) return null;

  
  return (
            <Modal
            isOpen={isOpen}
            onRequestClose={handleModalClose}
            contentLabel="Edit Subject"
            className="modal"              // เพิ่ม prop เพื่อกำหนด style ของ modal content
            overlayClassName="editoverlay"     // เพิ่ม prop เพื่อกำหนด style ของ overlay
            >
            <h2>Edit Subject</h2>
            <form action="">
                    <input type="text" onChange={(e)  => { setStdNo(e.target.value) }} placeholder="Study No." />
                    <input type="date" onChange={(e)  => { setStartDate(e.target.value) }} placeholder="Start date" />
                    <input type="date" onChange={(e)  => { setEndDate(e.target.value) }} placeholder="End date"  />
                    <input type="text" onChange={(e)  => { setPM(e.target.value) }} placeholder="PM"  />
                    <input type="text" onChange={(e)  => { setType(e.target.value) }} placeholder="Study type"  />
                    <input type="submit" onClick={submit} />
                    </form>
    </Modal>
  );
};

export default StudyEditModal;