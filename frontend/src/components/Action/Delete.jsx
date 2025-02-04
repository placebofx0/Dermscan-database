import React from "react";
import axios from "axios";

const DeleteButton = ({ id, data, setData, filteredData, setFilteredData, API_URL }) => {
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:8000/${API_URL}/${id}`);
                setData(data.filter((item) => item._id !== id)); // ลบออกจาก state
                setFilteredData(filteredData.filter((item) => item._id !== id)); // อัปเดต filteredData
                alert("Record deleted successfully!");
                } catch (error) {
                console.error("Error deleting record:", error);
                alert("Failed to delete record.");
                }
            }
        };

        return <button className="btn-danger" onClick={() => handleDelete(id)}>Delete</button>;
};

export default DeleteButton;

{/* <DeleteButton 
    id={item._id} 
    data={data} 
    setData={setData} 
    filteredData={filteredData} 
    setFilteredData={setFilteredData} 
    API_URL="your-api-endpoint"
/> */}