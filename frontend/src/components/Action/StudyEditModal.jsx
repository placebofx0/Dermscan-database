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