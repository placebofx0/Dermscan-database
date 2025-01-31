import axios from "axios";

const API_URL = "http://localhost:8000/subjects";

// ดึงข้อมูลทั้งหมด
export const getAllSubjects = async () => {
  try {
      const response = await axios.get(`${API_URL}/subjectmain`);
      return response.data; // ส่งข้อมูลกลับไปให้ Component
  } catch (error) {
      console.error("Error fetching subjects:", error);
      throw error; // ส่ง error ไปให้ Component จัดการ
  }
};

// ดึงข้อมูลเฉพาะ ID
export const getSubjectById = async (id) => {
  try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
  } catch (error) {
      console.error("Error fetching subject:", error);
      throw error;
  }
};

// เพิ่มข้อมูลใหม่
export const createSubject = async (subjectData) => {
  try {
      const response = await axios.post(API_URL, subjectData);
      return response.data;
  } catch (error) {
      console.error("Error creating subject:", error);
      throw error;
  }
};

// แก้ไขข้อมูล
export const updateSubject = async (id, subjectData) => {
  try {
      const response = await axios.put(`${API_URL}/${id}`, subjectData);
      return response.data;
  } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
  }
};

// ลบข้อมูล
export const deleteSubject = async (id) => {
  try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
  } catch (error) {
      console.error("Error deleting subject:", error);
      throw error;
  }
};