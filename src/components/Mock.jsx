import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const MockInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { role, company, jd } = location.state || {};

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (role) params.append('role', role);
      if (company) params.append('company', company);
      if (jd) params.append('jd', jd);
      const response = await axios.get(`/api/interview?${params.toString()}`);
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const storeAnswers = async () => {
    try {
      await axios.post('/api/storeAnswers', { answers });
      alert('Answers stored successfully');
    } catch (error) {
      console.error('Error storing answers:', error);
    }
  };

  return (
    <div className="mock-interview">
      <h1>Mock Interview</h1>
      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length > 0 ? (
        <>
          {questions.map((question, index) => (
            <div key={index}>
              <p>{question}</p>
              <textarea
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </div>
          ))}
          <button onClick={storeAnswers}>Submit Answers</button>
        </>
      ) : (
        <button onClick={fetchQuestions}>Start Interview</button>
      )}
    </div>
  );
};

export default MockInterview;