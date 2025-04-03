import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MockInterview = ({ config, onFinish, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [config]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/generate-questions', {
        jd: config.jd || `${config.role} at ${config.company}`,
      });
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

  const submitAnswers = async () => {
    setLoading(true);
    try {
      const interviewResponse = await axios.post('/api/store-answers', { answers });
      const interviewId = interviewResponse.data.interviewId;

      const evaluationPromises = Object.entries(answers).map(async ([index, answer]) => {
        const evalResponse = await axios.post('/api/evaluate-answer', {
          answer,
          question: questions[index],
          isAudio: false,
        });
        const feedbackResponse = await axios.post('/api/generate-feedback', {
          answer,
          score: evalResponse.data.score,
        });
        return {
          question: questions[index],
          answer,
          score: evalResponse.data.score,
          feedback: feedbackResponse.data.feedback,
        };
      });

      const results = await Promise.all(evaluationPromises);
      if (onFinish) {
        onFinish(results);
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mock-interview">
      <h1>Mock Interview</h1>
      {loading ? (
        <p>Loading...</p>
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
          <button onClick={submitAnswers}>Submit Answers</button>
          {onBack && (
            <button onClick={onBack} className="back-button">
              Back
            </button>
          )}
        </>
      ) : (
        <p>No questions available. Please try again.</p>
      )}
    </div>
  );
};

export default MockInterview;