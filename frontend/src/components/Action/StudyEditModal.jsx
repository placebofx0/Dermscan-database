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
            contentLabel="Edit Study"
            className="modal"              // เพิ่ม prop เพื่อกำหนด style ของ modal content
            overlayClassName="editoverlay"     // เพิ่ม prop เพื่อกำหนด style ของ overlay
            >
            <h2>Edit Study</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                value={editingItem.StdNo || ""}
                onChange={(e) => setEditingItem({ ...editingItem, StdNo: e.target.value })}
                placeholder="Study No."
              />
              <input
                type="date"
                value={editingItem.StartDate ? new Date(editingItem.StartDate).toISOString().split("T")[0] : ""}
                onChange={(e) => setEditingItem({ ...editingItem, StartDate: e.target.value })}
                placeholder="Start date"
              />
              <input
                type="date"
                value={editingItem.EndDate ? new Date(editingItem.EndDate).toISOString().split("T")[0] : ""}
                onChange={(e) => setEditingItem({ ...editingItem, EndDate: e.target.value })}
                placeholder="End date"
              />
              <input
                type="text"
                value={editingItem.PM || ""}
                onChange={(e) => setEditingItem({ ...editingItem, PM: e.target.value })}
                placeholder="PM"
              />
              <input
                type="text"
                value={editingItem.Type || ""}
                onChange={(e) => setEditingItem({ ...editingItem, Type: e.target.value })}
                placeholder="Study type"
              />
              <button type="button" onClick={handleSave}>Save</button>
              <button type="button" onClick={handleModalClose}>Cancel</button>
            </form>
    </Modal>
  );
};

export default StudyEditModal;