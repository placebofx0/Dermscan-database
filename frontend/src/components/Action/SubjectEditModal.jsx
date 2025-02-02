import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";

// กำหนดให้ Modal รู้จัก element หลักของแอป
Modal.setAppElement("#root");

const SubjectEditModal = ({ isOpen, onClose, onSubjectEdited, API_URL, subject }) => {
  const [editingItem, setEditingItem] = useState(subject);

  useEffect(() => {
    setEditingItem(subject);
  }, [subject]);

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editingItem._id}`, editingItem);
      alert("Record updated successfully!");
      onSubjectEdited(response.data);
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
      <form>
        <input
          name="IdNo"
          value={editingItem.IdNo || ""}
          onChange={(e) => setEditingItem({ ...editingItem, IdNo: e.target.value })}
          placeholder="Id card No."
        />
        <input
          name="Name"
          value={editingItem.Name || ""}
          onChange={(e) => setEditingItem({ ...editingItem, Name: e.target.value })}
          placeholder="Name"
        />
        <input
          name="Lname"
          value={editingItem.Lname || ""}
          onChange={(e) => setEditingItem({ ...editingItem, Lname: e.target.value })}
          placeholder="Surname"
        />
        <input
          name="InitialLname"
          value={editingItem.InitialLname || ""}
          onChange={(e) => setEditingItem({ ...editingItem, InitialLname: e.target.value })}
          placeholder="Last name"
        />
        <input
          name="InitialName"
          value={editingItem.InitialName || ""}
          onChange={(e) => setEditingItem({ ...editingItem, InitialName: e.target.value })}
          placeholder="First name"
        />
        <input
          type="date"
          name="BirthDate"
          value={editingItem.BirthDate ? editingItem.BirthDate.split("T")[0] : ""}
          onChange={(e) => setEditingItem({ ...editingItem, BirthDate: e.target.value })}
          placeholder="Birth date (YYYY-MM-DD)"
        />
        <input
          name="Phone"
          value={editingItem.Phone || ""}
          onChange={(e) => setEditingItem({ ...editingItem, Phone: e.target.value })}
          placeholder="Phone"
        />
        <input
          name="Address"
          value={editingItem.Address || ""}
          onChange={(e) => setEditingItem({ ...editingItem, Address: e.target.value })}
          placeholder="Address"
        />
        <label>Status:</label>
        <select
          name="Status"
          value={editingItem.Status || "Active"}
          onChange={(e) => setEditingItem({ ...editingItem, Status: e.target.value })}
        >
          <option value="Active">Active</option>
          <option value="Blacklist">Blacklist</option>
        </select>
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={handleModalClose}>Cancel</button>
      </form>
    </Modal>
  );
};

export default SubjectEditModal;
