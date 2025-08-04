const express = require('express');
const router = express.Router();
require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/gemini-microtasks
router.post('/', async (req, res) => {
    console.log('Received request for microtasks:', req.body);
  const { goal, days, description } = req.body;
  if (!goal) return res.status(400).json({ error: 'No goal provided' });
  const numDays = days || 7;
  try {
    let prompt = `Break down the following goal into a detailed, step-by-step daily plan for ${numDays} days. Each day should have a clear, actionable microtask. Respond in JSON array format, where each item is an object with 'day' (number) and 'title' (string) fields.\nGoal: ${goal}`;
    if (description && description.trim()) {
      prompt += `\nDescription: ${description}`;
    }
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    let microtasks = [];
    try {
      // Try to parse JSON from Gemini response
      microtasks = JSON.parse(response.text);
    } catch (e) {
      // Fallback: try to extract JSON from text
      const match = response.text.match(/\[.*\]/s);
      if (match) {
        microtasks = JSON.parse(match[0]);
      }
    }
    if (!Array.isArray(microtasks)) {
      return res.status(500).json({ error: 'Failed to parse microtasks from Gemini response.' });
    }
    res.json({ microtasks });
  } catch (err) {
    console.error('Error fetching microtasks from Gemini API:', err);
    res.status(500).json({ error: 'Failed to get microtasks from Gemini API' });
  }
});

module.exports = router;
