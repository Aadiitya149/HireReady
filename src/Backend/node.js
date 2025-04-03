// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware to parse JSON
app.use(express.json());

// Endpoint to fetch data using the API key
app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get(
      `https://example.com/api/resource`, // Replace with the actual API URL
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
