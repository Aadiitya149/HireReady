// src/api/interview.js

import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await axios.post(
        'https://gemini-api.com/generate-questions',
        { prompt: 'Generate 5 mock interview questions' },
        { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GEMINI_API_KEY}` } }
      );
      res.status(200).json({ questions: response.data.questions });
    } catch (error) {
      res.status(500).json({ error: 'Error generating questions' });
    }
  }
}
