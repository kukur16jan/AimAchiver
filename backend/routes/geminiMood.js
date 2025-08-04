const express = require('express');
const router = express.Router();

require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// POST /api/gemini-mood
router.post('/', async (req, res) => {
  const { moodInput } = req.body;
  if (!moodInput) return res.status(400).json({ error: 'Mood input required' });
  try {
    const prompt = `A user submitted this mood input: "${moodInput}".\n1. Rate their mood on a scale of 1 (very low) to 5 (very high).\n2. If the mood is 4 or 5, give a short motivational quote.\n3. If the mood is below 3, give a short practical advice.\nRespond in JSON: { "rating": <1-5>, "quote"?: <string>, "advice"?: <string> }`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    let geminiData = {};
    try {
      geminiData = JSON.parse(response.text);
    } catch (e) {
      const match = response.text.match(/\{[\s\S]*\}/);
      if (match) {
        geminiData = JSON.parse(match[0]);
      }
    }
    if (!geminiData || typeof geminiData.rating !== 'number') {
      return res.status(500).json({ error: 'Failed to parse mood evaluation from Gemini response.' });
    }
    res.json(geminiData);
  } catch (err) {
    console.error('Error fetching mood evaluation from Gemini API:', err);
    res.status(500).json({ error: 'Failed to get mood evaluation from Gemini API' });
  }
});

module.exports = router;
