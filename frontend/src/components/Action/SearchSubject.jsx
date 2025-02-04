import React from "react";

const SearchSubject = async () => {
    if (!query.trim()) {
        alert("Please enter a search term.");
        return;
    }

    try {
        const response = await axios.get(`http://localhost:8000/studyprofile?query=${query}`);
        setSearchResult(response.data);
    } catch (error) {
        console.error("Error searching subjects:", error);
    }
};

  const addSubjectToTable = () => {
      if (searchResult && !addedSubjects.some((item) => item.IdNo === searchResult.IdNo)) {
          setAddedSubjects([...addedSubjects, searchResult]);
          setSearchResult(null); // ล้างผลลัพธ์หลังจากเพิ่ม
          setQuery(""); // ล้างช่องค้นหา
      }
  };