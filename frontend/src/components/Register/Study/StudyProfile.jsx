import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStudyById } from "../../../services/study.api";
import SearchSubject from "../../Action/SearchSubject";
import SubjectRegisterModal from "../../Action/SubjectRegisterModal";
import SubjectEditModal from "../../Action/SubjectEditModal";
import DeleteButton from "../../Action/Delete";
import CreateRelation from "../../Action/RelationCreate";
import ScreeningListTable from "../../Action/ScreeningListTable";

function StudyProfile() {
  const { id } = useParams();
  const [study, setStudy] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const endpoint = "http://localhost:8000/studyprofile";
  const API_URL = "http://localhost:8000";

  useEffect(() => {
    async function fetchStudy() {
      try {
        console.log("Fetching study with id:", id);
        const response = await getStudyById(id);
        setStudy(response);
      } catch (error) {
        console.error("Error fetching Study profile:", error);
      }
    }
    if (id) {
      fetchStudy();
    }
  }, [id]);

  const calculateAge = (birthDate) => {
    if (!birthDate) return "N/A";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubjectAdded = (newSubject) => {
    setData([...data, newSubject]);
    setFilteredData([...filteredData, newSubject]);
  };

  const handleEdit = (subject) => {
    setSelectedSubject(subject);
    setEditModalOpen(true);
  };

  const handleSubjectEdited = (editedSubject) => {
    const updatedData = data.map((item) =>
      item._id === editedSubject._id ? editedSubject : item
    );
    setData(updatedData);
    setFilteredData(updatedData);
  };

  if (!study) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Study Profile</h1>
      <p>Study: {study.StdNo}</p>
      <p>
        Start date:{" "}
        {study.StartDate
          ? new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(study.StartDate))
          : "N/A"}
      </p>
      <p>
        End date:{" "}
        {study.EndDate
          ? new Intl.DateTimeFormat("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            }).format(new Date(study.EndDate))
          : "N/A"}
      </p>
      <p>PM: {study.PM}</p>
      <p>Study type: {study.Type}</p>

      <h2>Search Subjects</h2>
      <SearchSubject apiUrl={endpoint} onSearchResult={setSearchResult} />
      <div className="flex-box">
        <p>If no subject found</p>
        <button className="btn" onClick={() => setModalOpen(true)}>Add Subject</button>
        <SubjectRegisterModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubjectAdded={handleSubjectAdded}
          API_URL={endpoint}
        />
      </div>
      <h3>Search Result:</h3>
      {searchResult ? (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Id card No</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Last name</th>
              <th>First name</th>
              <th>Birth Date</th>
              <th>Age</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{searchResult.IdNo}</td>
              <td>{searchResult.Name}</td>
              <td>{searchResult.Lname}</td>
              <td>{searchResult.InitialLname}</td>
              <td>{searchResult.InitialName}</td>
              <td>
                {searchResult.BirthDate
                  ? new Date(searchResult.BirthDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{calculateAge(searchResult.BirthDate)}</td>
              <td>{searchResult.Phone}</td>
              <td>{searchResult.Address}</td>
              <td>{searchResult.Status}</td>
              <td>
                <CreateRelation
                  study={study}
                  subject={searchResult}
                  apiUrl={API_URL}
                  onPairSuccess={(data) => console.log("Pairing successful:", data)}
                  onPairError={(error) => console.error("Pairing error:", error)}
                />
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>No subject found</p>
      )}

      <ScreeningListTable studyId={id} />
    </div>
  );
}

export default StudyProfile;
