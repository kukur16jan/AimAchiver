const express = require('express');
const router = express.Router();
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/gemini
router.post('/', async (req, res) => {
  const { question } = req.body;
  console.log('Received question:', question);
  if (!question) return res.status(400).json({ error: 'No question provided' });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
    });
    const answer = response.text || 'No answer received.';
    res.json({ answer });
  } catch (err) {
    console.error('Error fetching from Gemini API:', err);
    res.status(500).json({ error: 'Failed to get response from Gemini API' });
  }
});

module.exports = router;
