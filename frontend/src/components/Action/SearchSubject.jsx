import React, { useState } from "react";
import axios from "axios";

const SearchSubject = ({ apiUrl, onSearchResult }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      alert("Please enter a search term.");
      return;
    }

    try {
      // ตัวอย่างการเรียก API: http://localhost:8000/studyprofile?query=...
      const response = await axios.get(`${apiUrl}`, {
        params: { query },
      });
      onSearchResult(response.data);
    } catch (error) {
      console.error("Error searching subjects:", error);
      onSearchResult(null);
    }
  };

  return (
    <div className="searchBox">
      <input
        type="text"
        placeholder="Search by IdNo, Name, or Surname"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="searchBar"
      />
      <button className="btn" onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchSubject;