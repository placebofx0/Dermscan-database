import axios from "axios";

const API_URL = "http://localhost:8000/studies";

// ดึงข้อมูลทั้งหมด
export const getAllStudies = async () => {
  try {
      const response = await axios.get(API_URL);
      return response.data; // ส่งข้อมูลกลับไปให้ Component
  } catch (error) {
      console.error("Error fetching studies:", error);
      throw error; // ส่ง error ไปให้ Component จัดการ
  }
};

// ดึงข้อมูลเฉพาะ ID
export const getStudyById = async (id) => {
  try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
  } catch (error) {
      console.error("Error fetching study:", error);
      throw error;
  }
};

// เพิ่มข้อมูลใหม่
export const createStudy = async (studyData) => {
  try {
      const response = await axios.post(API_URL, studyData);
      return response.data;
  } catch (error) {
      console.error("Error creating study:", error);
      throw error;
  }
};

// แก้ไขข้อมูล
export const updateStudy = async (id, studyData) => {
  try {
      const response = await axios.put(`${API_URL}/${id}`, studyData);
      return response.data;
  } catch (error) {
      console.error("Error updating study:", error);
      throw error;
  }
};

// ลบข้อมูล
export const deleteStudy = async (id) => {
  try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
  } catch (error) {
      console.error("Error deleting study:", error);
      throw error;
  }
};