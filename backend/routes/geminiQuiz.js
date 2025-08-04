const express = require('express');
const router = express.Router();
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/gemini-quiz
// Expects: { microtaskTitle: string }
router.post('/', async (req, res) => {
  const { microtaskTitle, numQuestions } = req.body;
  if (!microtaskTitle) return res.status(400).json({ error: 'No microtask title provided' });
  const n = 10;
  try {
    const prompt = `Generate a quiz of exactly ${n} questions with correct answers for the following task. The quiz should be related to the task and test understanding or completion. Respond in JSON array format, where each item is an object with 'question' (string), 'options' (array of strings), and 'answer' (string, the correct option).\nTask: ${microtaskTitle}`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    let quiz = [];
    try {
      quiz = JSON.parse(response.text);
    } catch (e) {
      const match = response.text.match(/\[.*\]/s);
      if (match) {
        quiz = JSON.parse(match[0]);
      }
    }
    if (!Array.isArray(quiz)) {
      return res.status(500).json({ error: 'Failed to parse quiz from Gemini response.' });
    }
    res.json({ quiz });
  } catch (err) {
    console.error('Error fetching quiz from Gemini API:', err);
    res.status(500).json({ error: 'Failed to get quiz from Gemini API' });
  }
});

module.exports = router;
