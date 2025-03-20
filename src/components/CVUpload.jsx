// src/components/CVUpload.jsx

import React, { useState } from "react";
import axios from "axios";

const CVUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("cv", file);

    try {
      const response = await axios.post("/api/upload", formData);
      onUploadSuccess(response.data.url);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="cv-upload">
      <h2 className="text-xl font-bold mb-4">Upload Your CV</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
};

export default CVUpload;
