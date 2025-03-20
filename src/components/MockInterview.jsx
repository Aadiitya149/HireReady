// src/components/MockInterview.jsx

import React, { useState } from "react";
import axios from "axios";

const MockInterview = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/interview");
      setQuestions(response.data.questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, answer) => {
    setAnswers((prev) => ({ ...prev, [index]: answer }));
  };

  const storeAnswers = async () => {
    try {
      await axios.post("/api/storeAnswers", { answers: Object.values(answers) });
      alert("Your answers have been stored!");
    } catch (error) {
      console.error("Error storing answers:", error);
    }
  };

  return (
    <div className="mock-interview">
      <h2 className="text-xl font-bold mb-4">Mock Interview</h2>
      {!questions.length ? (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={fetchQuestions}
          disabled={loading}
        >
          {loading ? "Loading..." : "Start Interview"}
        </button>
      ) : (
        <div>
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <p>{question}</p>
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Your answer..."
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </div>
          ))}
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={storeAnswers}
          >
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default MockInterview;
