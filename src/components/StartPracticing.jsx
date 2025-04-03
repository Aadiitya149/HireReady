import React, { useState } from 'react';
import axios from 'axios';

const StartPracticing = ({ onStart, onBack }) => {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [jd, setJd] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('cv', file);
      try {
        await axios.post('/api/upload', formData);
      } catch (error) {
        console.error('Error uploading CV:', error);
        return;
      }
    }
    if (onStart) {
      onStart({ role, company, jd });
    }
  };

  return (
    <div className="start-practicing">
      <h1>Start Practicing</h1>
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="input-field"
      />
      <input
        type="text"
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="input-field"
      />
      <textarea
        placeholder="Job Description"
        value={jd}
        onChange={(e) => setJd(e.target.value)}
        className="textarea-field"
      />
      <input type="file" onChange={handleFileChange} className="file-input" />
      <button onClick={handleSubmit} className="start-interview-button">
        Start Interview
      </button>
      {onBack && (
        <button onClick={onBack} className="back-button">
          Back
        </button>
      )}
    </div>
  );
};

export default StartPracticing;