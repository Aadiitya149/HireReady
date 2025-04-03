import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StartPracticing from './components/StartPracticing';
import MockInterview from './components/MockInterview';
import ParticlesBackground from './components/ParticlesBackground';

function App() {
  const [step, setStep] = useState('landing'); // Tracks current screen: landing, setup, interview, feedback
  const [interviewConfig, setInterviewConfig] = useState({}); // Stores role, company, jd
  const [responses, setResponses] = useState([]); // Stores questions, answers, scores, feedback

  const handleCandidateStart = (config) => {
    setInterviewConfig(config);
    setStep('interview');
  };

  const handleFinish = (userResponses) => {
    setResponses(userResponses);
    setStep('feedback');
  };

  const handleBackToLanding = () => {
    setStep('landing');
    setInterviewConfig({});
    setResponses([]);
  };

  return (
    <div className="App">
      <ParticlesBackground />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Navbar onHRClick={() => setStep('hr')} onCandidateClick={() => setStep('setup')} />

        {step === 'landing' && (
          <HeroSection onStartPracticing={() => setStep('setup')} />
        )}

        {step === 'setup' && (
          <StartPracticing onStart={handleCandidateStart} onBack={handleBackToLanding} />
        )}

        {step === 'interview' && (
          <MockInterview config={interviewConfig} onFinish={handleFinish} onBack={handleBackToLanding} />
        )}

        {step === 'feedback' && (
          <div className="feedback-screen">
            <h1>Feedback</h1>
            {responses.length > 0 ? (
              responses.map((result, index) => (
                <div key={index} className="result">
                  <p><strong>Question:</strong> {result.question}</p>
                  <p><strong>Your Answer:</strong> {result.answer}</p>
                  <p><strong>Score:</strong> {result.score}/10</p>
                  <p><strong>Feedback:</strong> {result.feedback}</p>
                </div>
              ))
            ) : (
              <p>No responses available.</p>
            )}
            <button onClick={handleBackToLanding}>Back to Home</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;