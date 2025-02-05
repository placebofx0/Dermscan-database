import axios from "axios";

const API_URL = "http://localhost:8000";

export const login = async (data) => {
  return await axios.post(`${API_URL}/`, data);
};

export const signup = async (data) => {
  return await axios.post(`${API_URL}/signup`, data);
};