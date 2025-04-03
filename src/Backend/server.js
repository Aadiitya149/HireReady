const express = require('express');
const pg = require('pg');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Multer setup for file uploads
const upload = multer({ dest: './public/uploads/' });

// Placeholder for Whisper (speech-to-text)
const whisper = {
  transcribe: async (audioBuffer) => "Transcribed audio text (placeholder)",
};

// Helper function to calculate score
const calculateScore = (bertScore, confidence) => {
  const similarity = bertScore.score || 0.5; // Placeholder
  return Math.round((similarity * 10 + confidence * 10) / 2);
};

// API Endpoints

// 1. Parse Input (BERT)
app.post('/api/parse-input', async (req, res) => {
  const { input } = req.body;
  if (!input) return res.status(400).json({ error: 'Input is required' });

  try {
    const response = await axios.post('https://api.huggingface.co/models/bert-base-uncased', {
      inputs: input,
      task: 'ner',
    }, {
      headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
    });

    const entities = response.data.map(entity => ({
      type: entity.entity_group,
      value: entity.word,
    }));
    res.json({ entities });
  } catch (error) {
    console.error('Error parsing input:', error.message);
    res.status(500).json({ error: 'Error parsing input' });
  }
});

// 2. Generate JD (LLaMA)
app.post('/api/generate-jd', async (req, res) => {
  const { role, company } = req.body;
  if (!role || !company) return res.status(400).json({ error: 'Role and company are required' });

  try {
    const response = await axios.post('https://api.huggingface.co/models/meta-llama/Llama-2-7b-hf', {
      inputs: `Generate a job description for a ${role} at ${company}. Include responsibilities and required skills.`,
    }, {
      headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
    });

    const jd = response.data.generated_text || "Generated JD placeholder";
    res.json({ jd });
  } catch (error) {
    console.error('Error generating JD:', error.message);
    res.status(500).json({ error: 'Error generating JD' });
  }
});

// 3. Generate Questions (LLaMA)
app.post('/api/generate-questions', async (req, res) => {
  const { jd, difficulty = 'medium' } = req.body;
  if (!jd) return res.status(400).json({ error: 'JD is required' });

  try {
    const response = await axios.post('https://api.huggingface.co/models/meta-llama/Llama-2-7b-hf', {
      inputs: `Generate 5 interview questions based on this job description: ${jd}, difficulty: ${difficulty}`,
    }, {
      headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
    });

    const questions = response.data.generated_text.split('\n').filter(q => q.trim());
    res.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error.message);
    res.status(500).json({ error: 'Error generating questions' });
  }
});

// 4. Evaluate Answer (Whisper, BERT, VADER)
app.post('/api/evaluate-answer', async (req, res) => {
  const { answer, question, isAudio } = req.body;
  if (!answer || !question) return res.status(400).json({ error: 'Answer and question are required' });

  let text = answer;
  if (isAudio) {
    try {
      const audioBuffer = Buffer.from(answer, 'base64');
      text = await whisper.transcribe(audioBuffer);
    } catch (error) {
      console.error('Error transcribing audio:', error.message);
      return res.status(500).json({ error: 'Error transcribing audio' });
    }
  }

  try {
    const bertResponse = await axios.post('https://api.huggingface.co/models/bert-base-uncased', {
      inputs: { text1: text, text2: question },
      task: 'similarity',
    }, {
      headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
    });

    const sentimentResponse = { confidence: 0.8 }; // Placeholder for VADER
    const score = calculateScore(bertResponse.data, sentimentResponse.confidence);

    res.json({ score, text });
  } catch (error) {
    console.error('Error evaluating answer:', error.message);
    res.status(500).json({ error: 'Error evaluating answer' });
  }
});

// 5. Generate Feedback (LLaMA)
app.post('/api/generate-feedback', async (req, res) => {
  const { answer, score } = req.body;
  if (!answer || typeof score !== 'number') return res.status(400).json({ error: 'Answer and score are required' });

  try {
    const response = await axios.post('https://api.huggingface.co/models/meta-llama/Llama-2-7b-hf', {
      inputs: `Generate feedback for this answer: "${answer}", score: ${score}/10`,
    }, {
      headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` },
    });

    const feedback = response.data.generated_text || "Feedback placeholder";
    res.json({ feedback });
  } catch (error) {
    console.error('Error generating feedback:', error.message);
    res.status(500).json({ error: 'Error generating feedback' });
  }
});

// 6. CV Upload
app.post('/api/upload', upload.single('cv'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
});

// 7. Store Answers
app.post('/api/store-answers', async (req, res) => {
  const { answers } = req.body;
  if (!answers) return res.status(400).json({ error: 'Answers are required' });

  try {
    const { rows } = await pool.query(
      'INSERT INTO interviews (role, company, jd, questions) VALUES ($1, $2, $3, $4) RETURNING id',
      ['unknown', 'unknown', 'unknown', JSON.stringify([])] // Placeholder values
    );
    const interviewId = rows[0].id;

    for (const [question, answer] of Object.entries(answers)) {
      await pool.query(
        'INSERT INTO answers (interview_id, question, answer) VALUES ($1, $2, $3)',
        [interviewId, question, answer]
      );
    }
    res.status(200).json({ message: 'Answers stored successfully', interviewId });
  } catch (error) {
    console.error('Error storing answers:', error.message);
    res.status(500).json({ error: 'Failed to store answers' });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS interviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        role VARCHAR(100),
        company VARCHAR(100),
        jd TEXT,
        questions JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,
        interview_id INTEGER REFERENCES interviews(id),
        question TEXT,
        answer TEXT,
        score INTEGER,
        feedback TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing database:', error.message);
  }
});