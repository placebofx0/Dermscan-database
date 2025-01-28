import axios from "axios";

const API_URL = "http://localhost:8000/subjects";

export const fechSubjects = async (data) => {
  return await axios.get(`${API_URL}/subjectsmain`, data);
};

export const createSubject = async (data) => {
  try {
    return await axios.post(`${API_URL}/subjectregister`, data); // ใช้ URL ที่ถูกต้อง
  } catch (error) {
    console.error("Error while sending data: ", error);
    throw error;
  }
};
