const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/upload-resumes', upload.array('resumes'), async (req, res) => {
  try {
    const resumeData = await Promise.all(
      req.files.map(async (file) => {
        const fileBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(fileBuffer);
        let extractedText = pdfData.text;

        if (!extractedText || extractedText.trim().length < 50) {
          const ocrResult = await Tesseract.recognize(file.path, 'eng', { logger: () => {} });
          extractedText = ocrResult.data.text;
        }

        fs.unlinkSync(file.path);
        return extractedText;
      })
    );
    res.json({ resumeData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process resumes' });
  }
});

app.post('/questions', (req, res) => {
  const { type, difficulty, resumeData } = req.body;
  const questions = resumeData
    ? resumeData.map((resume) => `Tell me about your experience mentioned in your resume: ${resume.slice(0, 100)}...`)
    : ['Tell me about yourself.', 'Why do you want this job?'];
  res.json({ questions });
});

app.post('/feedback', (req, res) => {
  const { responses } = req.body;
  const feedback =
    responses.length > 0 ? 'Your answers were detailed, but try to be more concise.' : 'Please provide more detailed answers.';
  res.json({ feedback });
});

app.listen(3000, () => console.log('Server running on port 3000'));
