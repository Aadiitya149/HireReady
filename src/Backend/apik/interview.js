import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { role, company, jd } = req.query;
    let prompt = 'Generate 5 mock interview questions';
    if (role && company) {
      prompt = `Generate 5 mock interview questions for a ${role} position at ${company}`;
    } else if (role) {
      prompt = `Generate 5 mock interview questions for a ${role} position`;
    } else if (jd) {
      prompt = `Generate 5 mock interview questions based on this job description: ${jd}`;
    }
    try {
      const response = await axios.post(
        'https://gemini-api.com/generate-questions',
        { prompt },
        { headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` } }
      );
      res.status(200).json({ questions: response.data.questions });
    } catch (error) {
      res.status(500).json({ error: 'Error generating questions' });
    }
  }
}