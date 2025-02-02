import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStudyById } from "../../../services/study.api";

function StudyProfile() {
    const { id } = useParams();
    const [Study, setStudy] = useState(null);

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

    // Render loading state if Study data is not available yet
    if (!Study) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>
                <p>Study: {Study.StdNo}</p>
                <p>
                    Start date:{" "}
                    {Study.StartDate
                        ? new Intl.DateTimeFormat("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                          }).format(new Date(Study.StartDate))
                        : "N/A"}
                </p>
                <p>
                    End date:{" "}
                    {Study.EndDate
                        ? new Intl.DateTimeFormat("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                          }).format(new Date(Study.EndDate))
                        : "N/A"}
                </p>
                <p>PM: {Study.PM}</p>
                <p>Study type: {Study.Type}</p>
            </h1>
        </div>
    );
}

export default StudyProfile;
