import React, { useState } from "react";
import axios from "axios";

const CreateRelation = ({ study, subject, apiUrl, onPairSuccess, onPairError }) => {
  const [isPairing, setIsPairing] = useState(false);

  const handlePair = async () => {
    if (!study || !subject) {
      alert("Study or subject data is missing.");
      return;
    }

    setIsPairing(true);
    try {
      const payload = {
        studyId: study._id,
        subjectId: subject._id,
      };

      const response = await axios.post(`${apiUrl}/studyprofile/relation`, payload);

      if (onPairSuccess) {
        onPairSuccess(response.data);
      }
      alert("Pairing successful!");
    } catch (error) {
      console.error("Error pairing subject:", error);
      if (onPairError) {
        onPairError(error);
      }
      alert("Error pairing subject.");
    } finally {
      setIsPairing(false);
    }
  };

  return (
    <button className="btn" onClick={handlePair} disabled={isPairing}>
      {isPairing ? "Pairing..." : "Pair Subject"}
    </button>
  );
};

export default CreateRelation;
